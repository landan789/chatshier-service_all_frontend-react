import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

export const CalendarEventTypes = Object.freeze({
    CALENDAR: 'CALENDAR',
    GOOGLE: 'GOOGLE'
});

class CalendarEditModal extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        let event = props.modalData ? props.modalData.event : {};
        this.state = {
            isAsyncWorking: false,
            /** @type {boolean} */
            isAllDay: event.isAllDay,
            /** @type {string} */
            title: event.title || '',
            /** @type {string} */
            description: event.description || '',
            /** @type {Date} */
            startDateTime: null,
            /** @type {Date} */
            endDateTime: null
        };

        this.prevStartDateTime = this.state.startDateTime;
        this.prevEndDateTime = this.state.endDateTime;

        this.titleChanged = this.titleChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.startDateTimeChanged = this.startDateTimeChanged.bind(this);
        this.endDateTimeChanged = this.endDateTimeChanged.bind(this);
        this.allDayChanged = this.allDayChanged.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    componentWillReceiveProps(props) {
        let event = props.modalData ? props.modalData.event : {};
        this.setState({
            isAsyncWorking: false,
            isAllDay: event.isAllDay,
            title: event.title || '',
            description: event.description || '',
            startDateTime: new Date(event.startedTime),
            endDateTime: new Date(event.endedTime)
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
            startedTime: this.state.startDateTime.getTime(),
            endedTime: this.state.endDateTime.getTime(),
            isAllDay: this.state.isAllDay ? 1 : 0
        };

        this.setState({ isAsyncWorking: true });
        return this.props.updateHandle(calendarId, eventId, eventType, event).then(() => {
            this.props.close(ev);
            return notify('更新成功', { type: 'success' });
        }).catch(() => {
            return notify('更新失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    deleteEvent(ev) {
        let calendarId = this.props.modalData.calendarId;
        let eventId = this.props.modalData.eventId;
        let userId = authHelper.userId;

        this.setState({ isAsyncWorking: true });
        return dbapi.calendarsEvents.delete(calendarId, eventId, userId).then(() => {
            this.props.close(ev);
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    titleChanged(ev) {
        this.setState({ title: ev.target.value });
    }

    descriptionChanged(ev) {
        this.setState({ description: ev.target.value });
    }

    startDateTimeChanged(dateTime) {
        this.setState({ startDateTime: dateTime });
    }

    endDateTimeChanged(dateTime) {
        this.setState({ endDateTime: dateTime });
    }

    allDayChanged(ev) {
        // 若使用者勾選全天項目，將時間調整成全天範圍
        // 取消全天的話恢復成原先的時間
        /** @type {Date} */
        let dayStart;
        /** @type {Date} */
        let dayEnd;

        if (ev.target.checked) {
            this.prevStartDateTime = this.state.startDateTime;
            this.prevEndDateTime = this.state.endDateTime;
            dayStart = new Date(this.state.startDateTime);
            dayStart.setHours(0, 0, 0, 0);
            dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
        } else {
            dayStart = this.prevStartDateTime;
            dayEnd = this.prevEndDateTime;
        }

        this.setState({
            isAllDay: ev.target.checked,
            startDateTime: dayStart,
            endDateTime: dayEnd
        });
    }

    render() {
        if (!this.props.modalData) {
            return null;
        }

        return (
            <Modal size="lg" className="ticket-edit-modal" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    編輯行事曆事件
                </ModalHeader>

                <ModalBody>
                    <div className="event-content">
                        <div className="form-group">
                            <input className="form-control event-title"
                                type="text"
                                placeholder="標題"
                                value={this.state.title}
                                onChange={this.titleChanged} />
                        </div>

                        <div className="form-group">
                            <p>開始時間</p>
                            <DateTimePicker
                                culture="zh-TW"
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                max={this.state.endDateTime}
                                value={this.state.startDateTime}
                                onChange={this.startDateTimeChanged}>
                            </DateTimePicker>
                        </div>

                        <div className="form-group">
                            <p>結束時間</p>
                            <DateTimePicker
                                culture="zh-TW"
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                min={this.state.startDateTime}
                                value={this.state.endDateTime}
                                onChange={this.endDateTimeChanged}>
                            </DateTimePicker>
                        </div>

                        <div className="form-group">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.isAllDay}
                                        onChange={this.allDayChanged} />
                                    是否為全天？
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea className="form-control event-description"
                                type="text"
                                placeholder="描述" rows="6"
                                value={this.state.description}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.updateEvent} disabled={this.state.isAsyncWorking}>更新</Button>
                    <Button color="danger" onClick={this.deleteEvent} disabled={this.state.isAsyncWorking}>刪除</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CalendarEditModal.propTypes = {
    modalData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    updateHandle: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
};

export default CalendarEditModal;
