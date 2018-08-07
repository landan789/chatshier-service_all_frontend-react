import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';
import { DateTimePicker } from 'react-widgets';

import { RRule, RRuleSet } from 'rrule';

import { Button, Modal, ModalHeader, ModalBody,
    FormGroup, Dropdown, DropdownToggle, DropdownMenu,
    DropdownItem } from 'reactstrap';

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
    [RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR]: 'Every weekday (Monday to Friday)'
};

class ScheduleModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        receptionistId: PropTypes.string.isRequired,
        scheduleId: PropTypes.string,
        schedule: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        let schedule = props.schedule || { start: {}, end: {} };
        let recurrence = schedule.recurrence || [];
        let startDateTime = new Date(schedule.start.dateTime || Date.now());
        let endDateTime = new Date(schedule.end.dateTime || Date.now());

        let repeatDropdownKey = RECURRENCE_OPTIONS.DOES_NOT_REPEAT;
        if (recurrence[0]) {
            let firstRule = recurrence[0].split(':').pop();
            let dailyRule = new RRule({
                freq: RRule.DAILY,
                until: endDateTime
            }).toString();

            let satRule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.SA],
                until: endDateTime
            }).toString();

            let mofrRule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                until: endDateTime
            }).toString();

            if (dailyRule === firstRule) {
                repeatDropdownKey = RECURRENCE_OPTIONS.DAILY;
            } else if (satRule === firstRule) {
                repeatDropdownKey = RECURRENCE_OPTIONS.WEEKLY_ON_SATURDAY;
            } else if (mofrRule === firstRule) {
                repeatDropdownKey = RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR;
            } else {
                repeatDropdownKey = RECURRENCE_OPTIONS.CUSTOM;
            }
        }

        this.state = {
            isOpen: this.props.isOpen,
            summary: schedule.summary || '',
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            isRepeatDropdownOpen: false,
            recurrence: recurrence,
            repeatDropdownKey: repeatDropdownKey
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onSummaryChanged = this.onSummaryChanged.bind(this);
        this.onStartDateTimeChanged = this.onStartDateTimeChanged.bind(this);
        this.onEndDateTimeChanged = this.onEndDateTimeChanged.bind(this);
        this.toggleRepeatDropdown = this.toggleRepeatDropdown.bind(this);
        this.onChangeRecurrence = this.onChangeRecurrence.bind(this);

        this.insertSchedule = this.insertSchedule.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    onSummaryChanged(ev) {
        this.setState({ summary: ev.target.value });
    }

    onStartDateTimeChanged(dateTime) {
        let nextState = {
            startDateTime: dateTime
        };
        let repeatKey = this.state.repeatDropdownKey;
        repeatKey && (nextState.recurrence = this._getRecurrence(repeatKey, this.state.endDateTime));
        this.setState(nextState);
    }

    onEndDateTimeChanged(dateTime) {
        let nextState = {
            endDateTime: dateTime
        };
        let repeatKey = this.state.repeatDropdownKey;
        repeatKey && (nextState.recurrence = this._getRecurrence(repeatKey, dateTime));
        this.setState(nextState);
    }

    onChangeRecurrence(ev) {
        let dropdownItem = ev.target;
        let key = dropdownItem.getAttribute('value');

        let nextState = {
            recurrence: this._getRecurrence(key, this.state.endDateTime),
            repeatDropdownKey: key
        };
        this.setState(nextState);
    }

    toggleRepeatDropdown() {
        this.setState({ isRepeatDropdownOpen: !this.state.isRepeatDropdownOpen });
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
            recurrence: this.state.recurrence
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
        let postSchedule = Object.assign({}, schedule);

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionistsSchedules.insert(appId, receptionistId, postSchedule).then(() => {
            this.setState({ isAsyncProcessing: false });
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    updateSchedule(scheduleId, schedule) {

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
                                onChange={this.onSummaryChanged} />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold"><Trans i18nKey="Start datetime" />:</label>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                max={this.state.endDateTime}
                                value={this.state.startDateTime}
                                onChange={this.onStartDateTimeChanged}>
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
                                onChange={this.onEndDateTimeChanged}>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <Dropdown className="recurrence-dropdown" isOpen={this.state.isRepeatDropdownOpen} toggle={this.toggleRepeatDropdown}>
                                <DropdownToggle color="light" caret><Trans i18nKey={RECURRENCE_TEXTS[this.state.repeatDropdownKey]} /></DropdownToggle>
                                <DropdownMenu>
                                    {Object.keys(RECURRENCE_OPTIONS).map((key) => {
                                        return (
                                            <DropdownItem key={key} value={key} onClick={this.onChangeRecurrence}>
                                                <Trans i18nKey={RECURRENCE_TEXTS[key]} />
                                            </DropdownItem>
                                        );
                                    })}
                                    <DropdownItem><Trans i18nKey="Custom" />...</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>

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
     * @param {Date} endDateTime
     */
    _getRecurrence(key, endDateTime) {
        if (key === RECURRENCE_OPTIONS.DOES_NOT_REPEAT) {
            return [];
        }

        let recurrence = [];
        let rruleSet = new RRuleSet();
        if (key === RECURRENCE_OPTIONS.DAILY) {
            let rrule = new RRule({
                freq: RRule.DAILY,
                until: endDateTime
            });
            rruleSet.rrule(rrule);
        } else if (key === RECURRENCE_OPTIONS.WEEKLY_ON_SATURDAY) {
            let rrule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.SA],
                until: endDateTime
            });
            rruleSet.rrule(rrule);
        } else if (key === RECURRENCE_OPTIONS.EVERY_WEEKDAY_MO_TO_FR) {
            let rrule = new RRule({
                freq: RRule.DAILY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                until: endDateTime
            });
            rruleSet.rrule(rrule);
        }
        recurrence = rruleSet.valueOf();
        return recurrence;
    }
}

export default withTranslate(ScheduleModal);
