import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import { notify } from '../../Notify/Notify';

import { CALENDAR_EVENT_TYPES } from '../../../containers/Calendar/Calendar';

import googleCalendarPng from '../../../image/google-calendar.png';

class CalendarEditModal extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        modalData: PropTypes.object,
        isOpen: PropTypes.bool.isRequired,
        updateHandle: PropTypes.func.isRequired,
        deleteHandle: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        let event = props.modalData ? props.modalData.event : {};
        this.state = {
            isOpen: this.props.isOpen,
            isAsyncWorking: false,
            /** @type {boolean} */
            isAllDay: event.isAllDay,
            /** @type {string} */
            title: event.title || '',
            /** @type {string} */
            description: event.description || '',
            /** @type {Date} */
            startDatetime: new Date(event.startedTime),
            /** @type {Date} */
            endDatetime: new Date(event.endedTime)
        };

        this.prevStartDatetime = this.state.startDatetime;
        this.prevEndDatetime = this.state.endDatetime;

        this.titleChanged = this.titleChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.startDatetimeChanged = this.startDatetimeChanged.bind(this);
        this.endDatetimeChanged = this.endDatetimeChanged.bind(this);
        this.allDayChanged = this.allDayChanged.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    titleChanged(ev) {
        this.setState({ title: ev.target.value });
    }

    descriptionChanged(ev) {
        this.setState({ description: ev.target.value });
    }

    startDatetimeChanged(dateTime) {
        this.setState({ startDatetime: dateTime });
    }

    endDatetimeChanged(dateTime) {
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

    updateEvent(ev) {
        let calendarId = this.props.modalData.calendarId;
        let eventId = this.props.modalData.eventId;
        let eventType = this.props.modalData.eventType;

        /** @type {Chatshier.CalendarEvent} */
        let event = {
            title: this.state.title,
            description: this.state.description,
            startedTime: this.state.startDatetime.getTime(),
            endedTime: this.state.endDatetime.getTime(),
            isAllDay: this.state.isAllDay ? 1 : 0
        };

        this.setState({ isAsyncWorking: true });
        return this.props.updateHandle(calendarId, eventId, eventType, event).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).then(() => {
            return this.props.close(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify(this.props.t('Failed to update!'), { type: 'danger' });
        });
    }

    deleteEvent(ev) {
        if (!window.confirm(this.props.t('Are you sure want to delete it?'))) {
            return Promise.resolve();
        }

        let calendarId = this.props.modalData.calendarId;
        let eventId = this.props.modalData.eventId;
        let eventType = this.props.modalData.eventType;

        this.setState({ isAsyncWorking: true });
        return this.props.deleteHandle(calendarId, eventId, eventType).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Delete successful!'), { type: 'success' });
        }).then(() => {
            return this.props.close(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify(this.props.t('Failed to delete!'), { type: 'danger' });
        });
    }

    render() {
        if (!this.props.modalData) {
            return null;
        }

        return (
            <Modal size="lg" className="calendar-edit-modal" isOpen={this.state.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    <Trans i18nKey="Edit calendar event" />
                    {this.props.modalData.eventType === CALENDAR_EVENT_TYPES.GOOGLE &&
                    this.props.modalData.origin.htmlLink &&
                    <a href={this.props.modalData.origin.htmlLink} target="_blank">
                        <img className="google-calendar-logo" src={googleCalendarPng} alt="Google Calendar" />
                    </a>}
                </ModalHeader>

                <ModalBody>
                    <div className="event-content">
                        <div className="form-group">
                            <input className="form-control event-title"
                                type="text"
                                placeholder={this.props.t('Title')}
                                value={this.state.title}
                                onChange={this.titleChanged} />
                        </div>

                        <div className="form-group">
                            <p><Trans i18nKey="Start datetime" /></p>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                max={this.state.endDatetime}
                                value={this.state.startDatetime}
                                onChange={this.startDatetimeChanged}>
                            </DateTimePicker>
                        </div>

                        <div className="form-group">
                            <p><Trans i18nKey="End datetime" /></p>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                min={this.state.startDatetime}
                                value={this.state.endDatetime}
                                onChange={this.endDatetimeChanged}>
                            </DateTimePicker>
                        </div>

                        <div className="form-group">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.isAllDay}
                                        onChange={this.allDayChanged} />
                                    <Trans i18nKey="Is it all day?" />
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea className="form-control event-description"
                                type="text"
                                placeholder={this.props.t('Description')}
                                rows="6"
                                value={this.state.description}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary"
                        onClick={this.updateEvent}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Update" />
                    </Button>
                    <Button color="danger"
                        onClick={this.deleteEvent}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Delete" />
                    </Button>
                    <Button color="secondary"
                        onClick={this.props.close}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(CalendarEditModal);
