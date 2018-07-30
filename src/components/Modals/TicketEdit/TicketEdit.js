import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { currentLanguage } from '../../../i18n';

import { toDueDateSpan } from '../../../utils/ticket';
import { formatDate, formatTime } from '../../../utils/unitTime';
import apiDatabase from '../../../helpers/apiDatabase/index';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

import './TicketEdit.css';

class TicketEditModal extends ModalCore {
    static propTypes = {
        appsAgents: PropTypes.object,
        modalData: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Model.Ticket} */
        let ticket = props.modalData ? props.modalData.ticket : {};
        let agentOptions = [];
        let firstAgentId = '';
        if (Object.keys(props.appsAgents).length > 0) {
            let appId = props.modalData.appId;
            /** @type {Chatshier.Model.Users} */
            let agents = props.appsAgents[appId].agents;

            for (let userId in agents) {
                firstAgentId = firstAgentId || userId;
                let consumer = agents[userId];
                agentOptions.push(
                    <option key={userId} value={userId}>{consumer.name}</option>
                );
            }
        }

        this.state = {
            isOpen: this.props.isOpen,
            isProcessing: false,
            dueTime: ticket.dueTime || new Date(),
            agentUserId: ticket.assigned_id || firstAgentId,
            agentOptions: agentOptions,
            status: ticket.status || 0,
            priority: ticket.priority || 0,
            description: ticket.description || ''
        };

        this.statusChanged = this.statusChanged.bind(this);
        this.agentChanged = this.agentChanged.bind(this);
        this.priorityChanged = this.priorityChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.dueTimeChanged = this.dueTimeChanged.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
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

        /** @type {Chatshier.Model.Ticket} */
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
            return this.closeModal(ev);
        }

        this.setState({ isProcessing: true });
        return apiDatabase.appsTickets.update(appId, ticketId, ticket).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify('待辦事項已更新', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('待辦事項更新失敗', { type: 'danger' });
        });
    }

    deleteTicket(ev) {
        if (!window.confirm('確定要刪除嗎？')) {
            return;
        }

        let appId = this.props.modalData.appId;
        let ticketId = this.props.modalData.ticketId;

        this.setState({ isProcessing: true });
        return apiDatabase.appsTickets.delete(appId, ticketId).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify('刪除成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    render() {
        let ticket = this.props.modalData ? this.props.modalData.ticket : {};
        let consumer = this.props.modalData ? this.props.modalData.consumer : {};

        return (
            <Modal className="ticket-edit-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
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
                                <option value="4">已處理</option>
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
                            <label className="col-12 col-form-label ticket-col">到期時間 {toDueDateSpan(ticket.dueTime)}</label>
                            <DateTimePicker
                                culture={currentLanguage}
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
                    <Button color="primary" onClick={this.updateTicket} disabled={this.state.isProcessing}>更新</Button>
                    <Button color="danger" onClick={this.deleteTicket} disabled={this.state.isProcessing}>刪除</Button>
                    <Button color="secondary" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default TicketEditModal;
