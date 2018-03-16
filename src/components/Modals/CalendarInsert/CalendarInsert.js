import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { formatDate, formatTime } from '../../../utils/unitTime';
import dbapi from '../../../helpers/databaseApi/index';
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
            startDateTime: null,
            endDateTime: null
        };

        this.titleChanged = this.titleChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.startDateTimeChanged = this.startDateTimeChanged.bind(this);
        this.endDateTimeChanged = this.endDateTimeChanged.bind(this);
        this.insertEvent = this.insertEvent.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.modalData) {
            this.setState({
                isAsyncWorking: false,
                isAllDay: false,
                title: '',
                description: '',
                startDateTime: props.modalData.startDateTime,
                endDateTime: props.modalData.endDateTime
            });
        }
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

    insertEvent(ev) {
        let event = {
            title: this.state.title,
            startedTime: this.state.startDateTime.getTime(),
            endedTime: this.state.endDateTime.getTime(),
            description: this.state.description,
            isAllDay: this.state.isAllDay ? 1 : 0
        };

        let userId = authHelper.userId;
        this.setState({ isAsyncWorking: true });
        return dbapi.calendarsEvents.insert(userId, event).then(() => {
            this.props.close(ev);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    render() {
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
                                value={this.state.endDateTime}
                                onChange={this.endDateTimeChanged}>
                            </DateTimePicker>
                        </div>

                        <div className="form-group">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" />
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
