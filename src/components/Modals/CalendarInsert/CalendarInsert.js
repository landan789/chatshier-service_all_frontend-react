import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

class CalendarInsertModal extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isAsyncWorking: false,
            isAllDay: false,
            title: '',
            description: '',
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
        this.insertEvent = this.insertEvent.bind(this);
    }

    componentWillReceiveProps(props) {
        if (!props.modalData) {
            return;
        }

        this.setState({
            isAsyncWorking: false,
            isAllDay: false,
            title: '',
            description: '',
            startDateTime: props.modalData.startDateTime,
            endDateTime: props.modalData.endDateTime
        });
    }

    titleChanged(ev) {
        this.setState({ title: ev.target.value });
    }

    descriptionChanged(ev) {
        this.setState({ description: ev.target.value });
    }

    startDateTimeChanged(dateTime) {
        this.prevStartDateTime = this.state.startDateTime;
        this.setState({ startDateTime: dateTime });
    }

    endDateTimeChanged(dateTime) {
        this.prevEndDateTime = this.state.endDateTime;
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

    insertEvent(ev) {
        let event = {
            title: this.state.title,
            startedTime: this.state.startDateTime.getTime(),
            endedTime: this.state.endDateTime.getTime(),
            description: this.state.description,
            isAllDay: this.state.isAllDay ? 1 : 0
        };

        if (!event.title) {
            return notify('請輸入事件標題名稱', { type: 'warning' });
        } else if (event.startedTime > event.endedTime) {
            return notify('開始時間需早於結束時間', { type: 'warning' });
        }

        let userId = authHelper.userId;
        this.setState({ isAsyncWorking: true });
        return apiDatabase.calendarsEvents.insert(userId, event).then(() => {
            this.props.close(ev);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    render() {
        if (!this.props.modalData) {
            return null;
        }

        return (
            <Modal className="calendar-insert-modal" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    新增行事曆事件
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
                            <textarea className="form-control event-content"
                                type="text"
                                placeholder="描述" rows="6"
                                value={this.state.description}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertEvent} disabled={this.state.isAsyncWorking}>新增</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CalendarInsertModal.propTypes = {
    modalData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default CalendarInsertModal;
