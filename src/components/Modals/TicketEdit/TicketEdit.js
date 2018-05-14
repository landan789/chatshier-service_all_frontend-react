import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import { toDueDateSpan } from '../../../utils/ticket';
import { formatDate, formatTime } from '../../../utils/unitTime';
import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

import './TicketEdit.css';

class TicketEditModal extends React.Component {
    static propTypes = {
        appsAgents: PropTypes.object,
        modalData: PropTypes.object,
        isOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isAsyncWorking: false,
            dueTime: new Date(),
            agentUserId: '',
            agentOptions: [],
            status: 0,
            priority: 0,
            description: ''
        };

        this.statusChanged = this.statusChanged.bind(this);
        this.agentChanged = this.agentChanged.bind(this);
        this.priorityChanged = this.priorityChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.dueTimeChanged = this.dueTimeChanged.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
    }

    componentWillReceiveProps(props) {
        if (!props.modalData) {
            return;
        }

        let agentOptions = [];
        if (Object.keys(props.appsAgents).length > 0) {
            let appId = props.modalData.appId;
            /** @type {Chatshier.Users} */
            let agents = props.appsAgents[appId].agents;

            for (let userId in agents) {
                let consumer = agents[userId];
                agentOptions.push(
                    <option key={userId} value={userId}>{consumer.name}</option>
                );
            }
        }

        /** @type {Chatshier.Ticket} */
        let ticket = props.modalData ? props.modalData.ticket : {};
        this.setState({
            agentUserId: ticket.assigned_id,
            agentOptions: agentOptions,
            dueTime: ticket.dueTime,
            status: ticket.status,
            priority: ticket.priority,
            description: ticket.description
        });
    }

    agentChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.setState({ agentUserId: selectedOpt.value });
    }

    statusChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.setState({ status: parseInt(selectedOpt.value, 10) });
    }

    priorityChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.setState({ priority: parseInt(selectedOpt.value, 10) });
    }

    descriptionChanged(ev) {
        this.setState({ description: ev.target.value });
    }

    dueTimeChanged(date) {
        this.setState({ dueTime: date.getTime() });
    }

    updateTicket(ev) {
        let appId = this.props.modalData.appId;
        let ticketId = this.props.modalData.ticketId;
        let userId = authHelper.userId;

        /** @type {Chatshier.Ticket} */
        let ticket = {
            assigned_id: this.state.agentUserId,
            dueTime: this.state.dueTime,
            status: this.state.status,
            priority: this.state.priority,
            description: this.state.description
        };

        let shouldUpdate = ((oldTicket, newTicket) => {
            if ((oldTicket.assigned_id !== newTicket.assigned_id) ||
                (oldTicket.dueTime !== newTicket.dueTime) ||
                (oldTicket.status !== newTicket.status) ||
                (oldTicket.priority !== newTicket.priority) ||
                (oldTicket.description !== newTicket.description)) {
                return true;
            }
            return false;
        })(this.props.modalData.ticket, ticket);

        if (!shouldUpdate) {
            return this.props.close(ev);
        }

        this.setState({ isAsyncWorking: true });
        return apiDatabase.appsTickets.update(appId, ticketId, userId, ticket).then(() => {
            this.props.close(ev);

            let agent = this.props.appsAgents[appId].agents[ticket.assigned_id];
            return notify('待辦事項已更新，指派人: ' + agent.name, { type: 'success' });
        }).catch(() => {
            return notify('待辦事項更新失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    deleteTicket(ev) {
        let appId = this.props.modalData.appId;
        let ticketId = this.props.modalData.ticketId;
        let userId = authHelper.userId;

        this.setState({ isAsyncWorking: true });
        return apiDatabase.appsTickets.delete(appId, ticketId, userId).then(() => {
            this.props.close(ev);
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    render() {
        let ticket = this.props.modalData ? this.props.modalData.ticket : {};
        let consumer = this.props.modalData ? this.props.modalData.consumer : {};

        return (
            <Modal size="lg" className="ticket-edit-modal" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    {consumer.name || ''}
                </ModalHeader>

                <ModalBody>
                    <div className="ticket-content">
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col">客戶ID</span>
                            <span className="col-6 ticket-col">{ticket.platformUid}</span>
                        </div>
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col priority">優先</span>
                            <select
                                className="col-6 form-control ticket-col"
                                value={this.state.priority}
                                onChange={this.priorityChanged}>
                                <option value="1">低</option>
                                <option value="2">中</option>
                                <option value="3">高</option>
                                <option value="4">急</option>
                            </select>
                        </div>
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col status">狀態</span>
                            <select
                                className="col-6 form-control ticket-col"
                                value={this.state.status}
                                onChange={this.statusChanged}>
                                <option value="2">未處理</option>
                                <option value="3">處理中</option>
                                <option value="4">已解決</option>
                                <option value="5">已關閉</option>
                            </select>
                        </div>
                        <div className="form-group row">
                            <p className="col-12 col-form-label ticket-col description">描述</p>
                            <span className="col-12 ticket-col">
                                <textarea
                                    className="form-control inner-text"
                                    value={this.state.description}
                                    onChange={this.descriptionChanged}
                                ></textarea>
                            </span>
                        </div>
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col agent">指派人</span>
                            <select
                                className="col-6 form-control ticket-col"
                                value={this.state.agentUserId}
                                onChange={this.agentChanged}>
                                {this.state.agentOptions}
                            </select>
                        </div>
                        <div className="form-group row">
                            <span className="col-12 col-form-label ticket-col">到期時間 {toDueDateSpan(ticket.dueTime)}</span>
                            <DateTimePicker
                                culture="zh-TW"
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                value={new Date(this.state.dueTime)}
                                onChange={this.dueTimeChanged}>
                            </DateTimePicker>
                        </div>
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col">建立日期</span>
                            <span className="col-6 ticket-col">
                                {formatDate(ticket.createdTime) + ' ' + formatTime(ticket.createdTime, false)}
                            </span>
                        </div>
                        <div className="form-group row">
                            <span className="col-6 col-form-label ticket-col">最後更新</span>
                            <span className="col-6 ticket-col">
                                {formatDate(ticket.updatedTime) + ' ' + formatTime(ticket.updatedTime, false)}
                            </span>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.updateTicket} disabled={this.state.isAsyncWorking}>更新</Button>
                    <Button color="danger" onClick={this.deleteTicket} disabled={this.state.isAsyncWorking}>刪除</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default TicketEditModal;
