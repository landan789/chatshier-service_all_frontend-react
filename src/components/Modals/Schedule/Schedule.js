import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';
import { DateTimePicker } from 'react-widgets';

import { RRule, RRuleSet, rrulestr } from 'rrule';

import { Button, ButtonGroup, Modal, ModalHeader, ModalBody,
    FormGroup, Dropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Card, Label, InputGroup, InputGroupAddon,
    Input, InputGroupButtonDropdown } from 'reactstrap';

import ModalCore from '../ModalCore';
import apiDatabase from '../../../helpers/apiDatabase';
import { formatDate, formatTime } from '../../../utils/unitTime';
import { notify } from '../../Notify/Notify';

import './Schedule.css';

const RECURRENCE_OPTIONS = Object.freeze({
    DOES_NOT_REPEAT: 'DOES_NOT_REPEAT',
    DAILY: 'DAILY',
    WEEKLY_ON_SATURDAY: 'WEEKLY_ON_SATURDAY',
    EVERY_WEEKDAY_MO_TO_FR: 'EVERY_WEEKDAY_MO_TO_FR',
    CUSTOM: 'CUSTOM'
});

const RECURRENCE_TEXTS = {
    [RECURRENCE_OPTIONS.DOES_NOT_REPEAT]: 'Does not repeat',
    [RECURRENCE_OPTIONS.DAILY]: 'Daily',
    [RECURRENCE_OPTIONS.WEEKLY_ON_SATURDAY]: 'Weekly on Saturday',
    [RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR]: 'Every weekday (Monday to Friday)',
    [RECURRENCE_OPTIONS.CUSTOM]: 'Custom'
};

const INTERVAL_OPTIONS = Object.freeze({
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY'
});

const INTERVAL_TEXTS = Object.freeze({
    [INTERVAL_OPTIONS.DAILY]: '天',
    [INTERVAL_OPTIONS.WEEKLY]: '週',
    [INTERVAL_OPTIONS.MONTHLY]: '個月',
    [INTERVAL_OPTIONS.YEARLY]: '年'
});

const UNTIL_TYPES = Object.freeze({
    NEVER: 'NEVER',
    UNTIL: 'UNTIL',
    COUNT: 'COUNT'
});

const DAYS_TEXTS = Object.freeze({
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
});

class ScheduleModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        receptionistId: PropTypes.string.isRequired,
        scheduleId: PropTypes.string,
        schedule: PropTypes.object
    }

    static dailyRuleStr = new RRule({
        freq: RRule.DAILY
    }).toString();

    static satRuleStr = new RRule({
        freq: RRule.DAILY,
        byweekday: [RRule.SA]
    }).toString();

    static mofrRuleStr = new RRule({
        freq: RRule.DAILY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
    }).toString();

    constructor(props, ctx) {
        super(props, ctx);

        let schedule = props.schedule || { start: {}, end: {} };
        let recurrence = schedule.recurrence || [];
        let startDateTime = new Date(schedule.start.dateTime || Date.now());
        let endDateTime = new Date(schedule.end.dateTime || Date.now());

        let repeatDropdownKey = RECURRENCE_OPTIONS.DOES_NOT_REPEAT;
        let firstRule = recurrence[0] ? rrulestr(recurrence[0]) : void 0;
        if (firstRule) {
            let ruleStr = firstRule.toString();
            if (ScheduleModal.dailyRuleStr === ruleStr) {
                repeatDropdownKey = RECURRENCE_OPTIONS.DAILY;
            } else if (ScheduleModal.satRule === ruleStr) {
                repeatDropdownKey = RECURRENCE_OPTIONS.WEEKLY_ON_SATURDAY;
            } else if (ScheduleModal.mofrRule === ruleStr) {
                repeatDropdownKey = RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR;
            } else {
                repeatDropdownKey = RECURRENCE_OPTIONS.CUSTOM;
            }
        }

        let untilType = UNTIL_TYPES.NEVER;
        if (firstRule && firstRule.options.until) {
            untilType = UNTIL_TYPES.UNTIL;
        } else if (firstRule && firstRule.options.count) {
            untilType = UNTIL_TYPES.COUNT;
        }

        this.state = {
            isOpen: this.props.isOpen,
            summary: schedule.summary || '',
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            isRepeatDropdownOpen: false,
            repeatDropdownKey: repeatDropdownKey,

            // Custom recurrence states
            isIntervalDropdownOpen: false,
            repeatDays: firstRule && firstRule.options.byweekday ? firstRule.options.byweekday : [],
            intervalValue: firstRule && firstRule.options.interval ? firstRule.options.interval : 1,
            intervalDropdownKey: (firstRule && INTERVAL_OPTIONS[RRule.FREQUENCIES[firstRule.options.freq]]) || INTERVAL_OPTIONS.DAILY,
            untilType: untilType,
            untilDateTime: firstRule && firstRule.options.until ? firstRule.options.until : endDateTime,
            repeatCount: firstRule && firstRule.options.count ? firstRule.options.count : 1
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.insertSchedule = this.insertSchedule.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let schedule = {
            summary: this.state.summary,
            start: {
                dateTime: this.state.startDateTime
            },
            end: {
                dateTime: this.state.endDateTime
            },
            recurrence: this._getRecurrence(this.state.repeatDropdownKey)
        };

        return Promise.resolve().then(() => {
            if (this.props.isUpdate) {
                return this.updateSchedule(this.props.scheduleId, schedule);
            }
            return this.insertSchedule(schedule);
        });
    }

    insertSchedule(schedule) {
        schedule = schedule || {};
        if (!schedule.summary) {
            return notify('必須輸入標題', { type: 'warning' });
        }

        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionistsSchedules.insert(appId, receptionistId, schedule).then(() => {
            this.setState({ isAsyncProcessing: false });
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    updateSchedule(scheduleId, schedule) {
        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;

        console.log(schedule);

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionistsSchedules.update(appId, receptionistId, scheduleId, schedule).then(() => {
            this.setState({ isAsyncProcessing: false });
            this.closeModal();
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    deleteSchedule(scheduleId) {
        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionistsSchedules.delete(appId, receptionistId, scheduleId).then(() => {
            this.setState({ isAsyncProcessing: false });
            this.closeModal();
            return notify(this.props.t('Remove successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    render() {
        return (
            <Modal className="schedule-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit schedule' : 'Add schedule'} />
                </ModalHeader>

                <ModalBody>
                    <form className="schedule-form" onSubmit={this.onSubmitForm}>
                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold"><Trans i18nKey="Title" />:</label>
                            <input className="form-control schedule-summary"
                                type="text"
                                placeholder={this.props.t('Fill the title')}
                                value={this.state.summary}
                                onChange={(ev) => this.setState({ summary: ev.target.value })} />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold"><Trans i18nKey="Start datetime" />:</label>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                max={this.state.endDateTime}
                                value={this.state.startDateTime}
                                onChange={(dateTime) => this.setState({ startDateTime: dateTime })}>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold"><Trans i18nKey="End datetime" />:</label>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                min={this.state.startDateTime}
                                value={this.state.endDateTime}
                                onChange={(dateTime) => this.setState({ endDateTime: dateTime })}>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <Dropdown className="recurrence-dropdown"
                                isOpen={this.state.isRepeatDropdownOpen}
                                toggle={() => this.setState({ isRepeatDropdownOpen: !this.state.isRepeatDropdownOpen })}>
                                <DropdownToggle color="light" caret><Trans i18nKey={RECURRENCE_TEXTS[this.state.repeatDropdownKey]} /></DropdownToggle>
                                <DropdownMenu>
                                    {Object.keys(RECURRENCE_OPTIONS).map((key) => (
                                        <DropdownItem key={key} onClick={() => this.setState({ repeatDropdownKey: key })}>
                                            <Trans i18nKey={RECURRENCE_TEXTS[key]} />
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>

                        {this.state.repeatDropdownKey === RECURRENCE_OPTIONS.CUSTOM &&
                        <Card className="mb-3 p-3">
                            <FormGroup>
                                <InputGroup>
                                    <Label className="my-auto mr-2"><Trans i18nKey="Repeat every" /></Label>
                                    <Input className="form-control text-right interval-value"
                                        type="number"
                                        value={this.state.intervalValue}
                                        min={1}
                                        onChange={(ev) => this.setState({ intervalValue: ev.target.value })} />
                                    <InputGroupButtonDropdown className="interval-dropdown" addonType="append"
                                        isOpen={this.state.isIntervalDropdownOpen}
                                        toggle={() => this.setState({ isIntervalDropdownOpen: !this.state.isIntervalDropdownOpen })}>
                                        <DropdownToggle className="btn-border" color="light" caret>{INTERVAL_TEXTS[this.state.intervalDropdownKey]}</DropdownToggle>
                                        <DropdownMenu>
                                            {Object.keys(INTERVAL_OPTIONS).map((key) => (
                                                <DropdownItem key={key} onClick={() => this.setState({ intervalDropdownKey: key })}>
                                                    {INTERVAL_TEXTS[key]}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </InputGroupButtonDropdown>
                                </InputGroup>
                            </FormGroup>

                            {this.state.intervalDropdownKey === INTERVAL_OPTIONS.WEEKLY &&
                            <FormGroup>
                                <Label className="mb-3"><Trans i18nKey="Repeat on" /></Label>
                                <ButtonGroup className="w-100 flex-wrap repeat-days">
                                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                        <Button key={day} color="light"
                                            className={'mx-1 border-circle day' + (this.state.repeatDays.indexOf(day) >= 0 ? ' active' : '')}
                                            onClick={() => {
                                                let _repeatDays = this.state.repeatDays.slice();
                                                let idx = _repeatDays.indexOf(day);
                                                if (idx < 0) {
                                                    _repeatDays.push(day);
                                                } else {
                                                    _repeatDays.splice(idx, 1);
                                                }
                                                return this.setState({ repeatDays: _repeatDays });
                                            }}>
                                            <span>{DAYS_TEXTS[day]}</span>
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </FormGroup>}

                            <FormGroup>
                                <Label className="mb-3">結束時間</Label>
                                <FormGroup check>
                                    <Label className="w-100" check>
                                        <Input className="mr-2" type="radio" name="endsType"
                                            value={UNTIL_TYPES.NEVER}
                                            checked={this.state.untilType === UNTIL_TYPES.NEVER}
                                            onChange={() => this.setState({ untilType: UNTIL_TYPES.NEVER })} />
                                        <span>持續不停</span>
                                    </Label>
                                </FormGroup>

                                <FormGroup className="mt-3" check>
                                    <Label className="w-100" check>
                                        <Input className="mr-2" type="radio" name="endsType"
                                            value={UNTIL_TYPES.UNTIL}
                                            checked={this.state.untilType === UNTIL_TYPES.UNTIL}
                                            onChange={() => this.setState({ untilType: UNTIL_TYPES.UNTIL })} />
                                        <span>於</span>

                                        <DateTimePicker
                                            disabled={this.state.untilType !== UNTIL_TYPES.UNTIL}
                                            culture={currentLanguage}
                                            format={(datetime) => formatDate(datetime)}
                                            time={false}
                                            min={this.state.startDateTime}
                                            value={this.state.untilDateTime}
                                            onChange={(dateTime) => this.setState({ untilDateTime: dateTime })}>
                                        </DateTimePicker>
                                    </Label>
                                </FormGroup>

                                <FormGroup className="mt-3" check>
                                    <Label className="w-100" check>
                                        <Input className="mr-2" type="radio" name="endsType"
                                            value={UNTIL_TYPES.COUNT}
                                            checked={this.state.untilType === UNTIL_TYPES.COUNT}
                                            onChange={() => this.setState({ untilType: UNTIL_TYPES.COUNT })} />
                                        <span>重複</span>

                                        <InputGroup>
                                            <Input className="text-right" type="number" min={1}
                                                disabled={this.state.untilType !== UNTIL_TYPES.COUNT}
                                                value={this.state.repeatCount}
                                                onChange={(ev) => this.setState({ repeatCount: ev.target.value })} />
                                            <InputGroupAddon addonType="append">次</InputGroupAddon>
                                        </InputGroup>
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                        </Card>}

                        <div className="d-flex align-items-center justify-content-end">
                            {!this.props.isUpdate &&
                            <Button className="mr-1" type="submit" color="primary"
                                disabled={this.state.isAsyncProcessing}>
                                <Trans i18nKey="Add" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="submit" color="primary"
                                disabled={this.state.isAsyncProcessing}>
                                <Trans i18nKey="Update" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="button" color="danger"
                                onClick={() => this.deleteSchedule(this.props.scheduleId)}
                                disabled={this.state.isAsyncProcessing}>
                                <Trans i18nKey="Remove" />
                            </Button>}

                            <Button className="ml-1" type="button" color="secondary" onClick={this.closeModal}>
                                <Trans i18nKey="Cancel" />
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        );
    }

    /**
     * @param {string} key
     */
    _getRecurrence(key) {
        if (key === RECURRENCE_OPTIONS.DOES_NOT_REPEAT) {
            return [];
        }

        let rruleSet = new RRuleSet();
        if (key === RECURRENCE_OPTIONS.DAILY) {
            let rrule = new RRule({
                freq: RRule.DAILY
            });
            rruleSet.rrule(rrule);
        } else if (key === RECURRENCE_OPTIONS.WEEKLY_ON_SATURDAY) {
            let rrule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.SA]
            });
            rruleSet.rrule(rrule);
        } else if (key === RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR) {
            let rrule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
            });
            rruleSet.rrule(rrule);
        } else if (key === RECURRENCE_OPTIONS.CUSTOM) {
            let freqMapping = {
                [INTERVAL_OPTIONS.DAILY]: RRule.DAILY,
                [INTERVAL_OPTIONS.WEEKLY]: RRule.WEEKLY,
                [INTERVAL_OPTIONS.MONTHLY]: RRule.MONTHLY,
                [INTERVAL_OPTIONS.YEARLY]: RRule.YEARLY
            };

            let options = {
                interval: this.state.intervalValue,
                freq: freqMapping[this.state.intervalDropdownKey]
            };

            if (this.state.intervalDropdownKey === INTERVAL_OPTIONS.WEEKLY &&
                this.state.repeatDays.length > 0) {
                let daysMapping = {
                    0: RRule.SU,
                    1: RRule.MO,
                    2: RRule.TU,
                    3: RRule.WE,
                    4: RRule.TH,
                    5: RRule.FR,
                    6: RRule.SA
                };
                let repeatDays = this.state.repeatDays.slice().sort((a, b) => a - b);
                options.byweekday = repeatDays.map((day) => daysMapping[day]);
            }

            if (this.state.untilType === UNTIL_TYPES.UNTIL) {
                options.until = this.state.untilDateTime;
            } else if (this.state.untilType === UNTIL_TYPES.COUNT) {
                options.count = this.state.repeatCount;
            }
            options.wkst = RRule.SU;

            let rrule = new RRule(options);
            rruleSet.rrule(rrule);
        }
        return rruleSet.valueOf();
    }
}

export default withTranslate(ScheduleModal);
