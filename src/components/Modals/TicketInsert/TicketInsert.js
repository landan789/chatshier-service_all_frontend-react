import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter } from 'reactstrap';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { DAY } from '../../../utils/unitTime';
import { notify } from '../../Notify/Notify';

const appTypes = dbapi.apps.enums.type;

class TicketInsertModal extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.selectedAppId = '';
        this.selectedPlatformUid = '';
        this.selectedAgentUserId = '';
        this.appOptions = this.appsToOptions();

        this.state = {
            isAsyncWorking: false,
            consumerOptions: this.consumersToOptions(),
            agentOptions: this.agentsToOptions(),
            platformUid: '',
            consumerEmail: '',
            consumerPhone: '',
            ticketDescription: ''
        };
        this.ticketStatus = 2;
        this.ticketPriority = 1;

        this.insertTicket = this.insertTicket.bind(this);
        this.appChanged = this.appChanged.bind(this);
        this.consumerChanged = this.consumerChanged.bind(this);
        this.agentChanged = this.agentChanged.bind(this);
        this.statusChanged = this.statusChanged.bind(this);
        this.priorityChanged = this.priorityChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
    }

    componentWillReceiveProps() {
        this.appOptions = this.appsToOptions();
        this.consumerChanged();
        this.agentChanged();
    }

    appsToOptions() {
        let options = [];

        /** @type {Chatshier.Apps} */
        let apps = this.props.apps || {};
        let firstAppId = '';

        for (let appId in apps) {
            let app = apps[appId];
            if (app.isDeleted || appTypes.CHATSHIER === app.type) {
                continue;
            }

            firstAppId = firstAppId || appId;
            options.push(
                <option key={appId} value={appId}>{app.name}</option>
            );
        }

        this.selectedAppId = firstAppId;
        return options;
    }

    consumersToOptions() {
        let options = [];

        /** @type {Chatshier.Consumers} */
        let consumers = this.props.consumers || {};

        let firstPlatformUid;
        for (let platformUid in consumers) {
            let consumer = consumers[platformUid];
            firstPlatformUid = firstPlatformUid || platformUid;
            options.push(
                <option key={platformUid} value={platformUid}>{consumer.name}</option>
            );
        }
        this.selectedPlatformUid = firstPlatformUid;
        return options;
    }

    agentsToOptions() {
        let options = [];
        let appsAgents = this.props.appsAgents;
        if (!(this.selectedAppId && appsAgents[this.selectedAppId])) {
            return options;
        }

        /** @type {Chatshier.Users} */
        let agents = appsAgents[this.selectedAppId].agents;

        let firstAgentUserId;
        for (let userId in agents) {
            let consumer = agents[userId];
            firstAgentUserId = firstAgentUserId || userId;
            options.push(
                <option key={userId} value={userId}>{consumer.name}</option>
            );
        }
        this.selectedAgentUserId = firstAgentUserId;
        return options;
    }

    appChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.selectedAppId = selectedOpt.value;
        this.consumerChanged();
        this.agentChanged();
    }

    consumerChanged(ev) {
        let newState = {};
        if (ev) {
            let selectedOpt = ev.target.selectedOptions[0];
            this.selectedPlatformUid = selectedOpt.value;
        } else {
            newState.consumerOptions = this.consumersToOptions();
        }

        /** @type {Chatshier.Consumer} */
        let consumers = this.props.consumers;
        let platformUid = this.selectedPlatformUid;
        if (platformUid && consumers[platformUid]) {
            let consumer = consumers[platformUid];
            newState.platformUid = platformUid;
            newState.consumerEmail = consumer.email;
            newState.consumerPhone = consumer.phone;
        }
        Object.keys(newState).length > 0 && this.setState(newState);
    }

    agentChanged(ev) {
        let newState = {};
        if (ev) {
            let selectedOpt = ev.target.selectedOptions[0];
            this.selectedAgentUserId = selectedOpt.value;
        } else {
            newState.agentOptions = this.agentsToOptions();
            this.setState(newState);
        }
    }

    statusChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.ticketStatus = parseInt(selectedOpt.value, 10);
    }

    priorityChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.ticketPriority = parseInt(selectedOpt.value, 10);
    }

    descriptionChanged(ev) {
        this.setState({ ticketDescription: ev.target.value });
    }

    insertTicket(ev) {
        if (!this.selectedAppId) {
            return notify('請選擇App', { type: 'warning' });
        } else if (!this.selectedPlatformUid) {
            return notify('請選擇目標客戶', { type: 'warning' });
        } else if (!this.state.ticketDescription) {
            return notify('請輸入說明內容', { type: 'warning' });
        }
        this.setState({ isAsyncWorking: true });

        let appId = this.selectedAppId;
        let userId = authHelper.userId;
        let ticket = {
            dueTime: Date.now() + (DAY * 3), // 過期時間預設為3天後
            platformUid: this.selectedPlatformUid,
            assigned_id: this.selectedAgentUserId,
            priority: this.ticketPriority,
            status: this.ticketStatus,
            description: this.state.ticketDescription
        };

        return dbapi.appsTickets.insert(appId, userId, ticket).then(() => {
            this.props.close(ev);

            let agent = this.props.appsAgents[appId].agents[ticket.assigned_id];
            return notify('待辦事項已新增，指派人: ' + agent.name, { type: 'success' });
        }).catch(() => {
            return notify('待辦事項新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }

    render() {
        return (
            <Modal size="lg" className="ticket-insert-modal" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    新增待辦事項
                </ModalHeader>

                <ModalBody>
                    <div className="ticket-content">
                        <div className="form-group">
                            <label htmlFor="app">App</label>
                            <select className="form-control" onChange={this.appChanged}>
                                {this.appOptions}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name" className="col-form-label">客戶姓名</label>
                            <select className="form-control" onChange={this.consumerChanged}>
                                {this.state.consumerOptions}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject" className="col-form-label">客戶ID</label>
                            <input type="text" className="form-control" value={this.state.platformUid} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-form-label">電子郵件</label>
                            <input type="text" className="form-control" value={this.state.consumerEmail} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="col-form-label">手機</label>
                            <input type="text" className="form-control" value={this.state.consumerPhone} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="assignedAgent" className="col-form-label">指派人</label>
                            <select className="form-control" onChange={this.agentChanged}>
                                {this.state.agentOptions}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">優先</label>
                            <select className="form-control">
                                <option value="1">低</option>
                                <option value="2">中</option>
                                <option value="3">高</option>
                                <option value="4">急</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">狀態</label>
                            <select className="form-control">
                                <option value="2">未處理</option>
                                <option value="3">處理中</option>
                                <option value="4">已解決</option>
                                <option value="5">已關閉</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">說明</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={this.ticketDescription}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertTicket} disabled={this.state.isAsyncWorking}>新增</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TicketInsertModal.propTypes = {
    appsAgents: PropTypes.object,
    apps: PropTypes.object,
    consumers: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default TicketInsertModal;
