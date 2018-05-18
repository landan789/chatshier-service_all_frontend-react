import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

class CalendarInsertModal extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        modalData: PropTypes.object,
        isOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen,
            isAsyncWorking: false,
            isAllDay: false,
            title: '',
            description: '',
            /** @type {Date} */
            startDatetime: this.props.modalData.startDatetime,
            /** @type {Date} */
            endDatetime: this.props.modalData.endDatetime
        };

        this.prevStartDatetime = this.state.startDatetime;
        this.prevEndDatetime = this.state.endDatetime;

        this.titleChanged = this.titleChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.startDatetimeChanged = this.startDatetimeChanged.bind(this);
        this.endDatetimeChanged = this.endDatetimeChanged.bind(this);
        this.allDayChanged = this.allDayChanged.bind(this);
        this.insertEvent = this.insertEvent.bind(this);
    }

    titleChanged(ev) {
        this.setState({ title: ev.target.value });
    }

    descriptionChanged(ev) {
        this.setState({ description: ev.target.value });
    }

    startDatetimeChanged(dateTime) {
        this.prevStartDatetime = this.state.startDatetime;
        this.setState({ startDatetime: dateTime });
    }

    endDatetimeChanged(dateTime) {
        this.prevEndDatetime = this.state.endDatetime;
        this.setState({ endDatetime: dateTime });
    }

    allDayChanged(ev) {
        // 若使用者勾選全天項目，將時間調整成全天範圍
        // 取消全天的話恢復成原先的時間
        /** @type {Date} */
        let dayStart;
        /** @type {Date} */
        let dayEnd;

        if (ev.target.checked) {
            this.prevStartDatetime = this.state.startDatetime;
            this.prevEndDatetime = this.state.endDatetime;
            dayStart = new Date(this.state.startDatetime);
            dayStart.setHours(0, 0, 0, 0);
            dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
        } else {
            dayStart = this.prevStartDatetime;
            dayEnd = this.prevEndDatetime;
        }

        this.setState({
            isAllDay: ev.target.checked,
            startDatetime: dayStart,
            endDatetime: dayEnd
        });
    }

    insertEvent(ev) {
        let event = {
            title: this.state.title,
            startedTime: this.state.startDatetime.getTime(),
            endedTime: this.state.endDatetime.getTime(),
            description: this.state.description,
            isAllDay: this.state.isAllDay ? 1 : 0
        };

        if (!event.title) {
            return notify(this.props.t('Please fill the event title'), { type: 'warning' });
        } else if (event.startedTime > event.endedTime) {
            return notify(this.props.t('Start datetime must be earlier than end datetime'), { type: 'warning' });
        }

        let userId = authHelper.userId;
        this.setState({ isAsyncWorking: true });
        return apiDatabase.calendarsEvents.insert(userId, event).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).then(() => {
            return this.props.close(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify(this.props.t('Failed to add!'), { type: 'danger' });
        });
    }

    render() {
        if (!this.props.modalData) {
            return null;
        }

        return (
            <Modal className="calendar-insert-modal" isOpen={this.state.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    <Trans i18nKey="Add calendar event" />
                </ModalHeader>

                <ModalBody>
                    <div className="event-content">
                        <FormGroup>
                            <input className="form-control event-title"
                                type="text"
                                placeholder={this.props.t('Title')}
                                value={this.state.title}
                                onChange={this.titleChanged} />
                        </FormGroup>

                        <FormGroup>
                            <p><Trans i18nKey="Start datetime" /></p>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                max={this.state.endDatetime}
                                value={this.state.startDatetime}
                                onChange={this.startDatetimeChanged}>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <p><Trans i18nKey="End datetime" /></p>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                min={this.state.startDatetime}
                                value={this.state.endDatetime}
                                onChange={this.endDatetimeChanged}>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.isAllDay}
                                        onChange={this.allDayChanged} />
                                    <Trans i18nKey="Is it all day?" />
                                </label>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <textarea className="form-control event-content"
                                type="text"
                                placeholder={this.props.t('Description')}
                                rows="6"
                                value={this.state.description}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </FormGroup>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertEvent} disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Add" />
                    </Button>
                    <Button color="secondary" onClick={this.props.close}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(CalendarInsertModal);
