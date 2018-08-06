import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import apiDatabase from '../../../helpers/apiDatabase/index';
import gCalendarHelper from '../../../helpers/googleCalendar';
import { CALENDAR_EVENT_TYPES, GoogleEventItem } from '../../../pages/Calendar/Calendar';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class CalendarModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        modalData: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Model.CalendarEvent} */
        let event = this.props.modalData.event || {};

        this.state = {
            isOpen: this.props.isOpen,
            isUpdate: this.props.isUpdate,
            isAsyncWorking: false,
            isAllDay: false,
            title: event.title || '',
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
        this.insertEvent = this.insertEvent.bind(this);
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
            return notify(this.props.t('Fill the event title'), { type: 'warning' });
        } else if (event.startedTime > event.endedTime) {
            return notify(this.props.t('Start datetime must be earlier than end datetime'), { type: 'warning' });
        }

        this.setState({ isAsyncWorking: true });
        return apiDatabase.calendarsEvents.insert(event).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify(this.props.t('Failed to add!'), { type: 'danger' });
        });
    }

    updateEvent(ev) {
        if (!this.props.isUpdate) {
            return notify(this.props.t('Failed to update!'), { type: 'danger' });
        }

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

        if (event.startedTime > event.endedTime) {
            return notify('開始時間需早於結束時間', { type: 'warning' }).then(() => {
                return Promise.reject(new Error('INVALID_DATE'));
            });
        }

        // 根據事件型態來判斷發送不同 API 進行資料更新動作
        this.setState({ isAsyncWorking: true });
        return Promise.resolve().then(() => {
            switch (eventType) {
                case CALENDAR_EVENT_TYPES.CALENDAR:
                    return apiDatabase.calendarsEvents.update(calendarId, eventId, event);
                case CALENDAR_EVENT_TYPES.GOOGLE:
                    let gEvent = {
                        summary: event.title,
                        description: event.description,
                        start: {
                            date: event.isAllDay ? formatDate(event.startedTime) : void 0,
                            dateTime: !event.isAllDay ? new Date(event.startedTime).toJSON() : void 0
                        },
                        end: {
                            date: event.isAllDay ? formatDate(event.endedTime) : void 0,
                            dateTime: !event.isAllDay ? new Date(event.endedTime).toJSON() : void 0
                        }
                    };

                    return gCalendarHelper.updateEvent('primary', eventId, gEvent).then((googleEvent) => {
                        let isAllDay = !!(googleEvent.start.date && googleEvent.end.date);
                        let startDate = isAllDay ? new Date(googleEvent.start.date) : new Date(googleEvent.start.dateTime);
                        isAllDay && startDate.setHours(0, 0, 0, 0);
                        let endDate = isAllDay ? new Date(googleEvent.end.date) : new Date(googleEvent.end.dateTime);
                        isAllDay && endDate.setHours(0, 0, 0, 0);

                        let eventItem = new GoogleEventItem({
                            calendarId: googleEvent.iCalUID,
                            id: eventId,
                            title: googleEvent.summary,
                            description: googleEvent.description,
                            start: startDate,
                            end: endDate,
                            origin: googleEvent
                        });
                        this.$calendar.fullCalendar('updateEvent', eventItem, true);
                    });
                default:
                    return Promise.reject(new Error('UNKNOWN_EVENT_TYPE'));
            }
        }).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
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
        return Promise.resolve().then(() => {
            // 根據事件型態來判斷發送不同 API 進行資料更新動作
            switch (eventType) {
                case CALENDAR_EVENT_TYPES.CALENDAR:
                    return apiDatabase.calendarsEvents.delete(calendarId, eventId);
                case CALENDAR_EVENT_TYPES.GOOGLE:
                    return gCalendarHelper.deleteEvent(calendarId, eventId);
                default:
                    return Promise.reject(new Error('UNKNOWN_EVENT_TYPE'));
            }
        }).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify(this.props.t('Remove successful!'), { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify(this.props.t('Failed to remove!'), { type: 'danger' });
        });
    }

    render() {
        if (!this.props.modalData) {
            return null;
        }

        return (
            <Modal className="calendar-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit calendar event' : 'Add calendar event'} />
                </ModalHeader>

                <ModalBody>
                    <div className="event-content">
                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold"><Trans i18nKey="Title" />:</label>
                            <input className="form-control event-title"
                                type="text"
                                placeholder={this.props.t('Fill the title')}
                                value={this.state.title}
                                onChange={this.titleChanged} />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold"><Trans i18nKey="Start datetime" />:</label>
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
                            <label className="col-form-label font-weight-bold"><Trans i18nKey="End datetime" />:</label>
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
                            <label className="form-check-label col-form-label font-weight-bold"><Trans i18nKey="Is it all day?" /></label>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.isAllDay}
                                        onChange={this.allDayChanged} />
                                    <Trans i18nKey="Yes" />
                                </label>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold"><Trans i18nKey="Event description" />:</label>
                            <textarea className="form-control event-content"
                                type="text"
                                placeholder={this.props.t('Fill the description')}
                                rows="5"
                                value={this.state.description}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </FormGroup>
                    </div>
                </ModalBody>

                <ModalFooter>
                    {!this.props.isUpdate && <Button color="primary"
                        onClick={this.insertEvent}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Add" />
                    </Button>}
                    {this.props.isUpdate && <Button color="primary"
                        onClick={this.updateEvent}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Update" />
                    </Button>}
                    {this.props.isUpdate && <Button color="danger"
                        onClick={this.deleteEvent}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Remove" />
                    </Button>}
                    <Button color="secondary" onClick={this.closeModal}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(CalendarModal);
