import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';

import apiDatabase from '../../../helpers/apiDatabase/index';
import { DAY } from '../../../utils/unitTime';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';
import { withTranslate } from '../../../i18n';

const APP_TYPES = apiDatabase.apps.TYPES;

class TicketInsertModal extends ModalCore {
    static propTypes = {
        appId: PropTypes.string,
        chatroomId: PropTypes.string,
        platformUid: PropTypes.string,
        apps: PropTypes.object,
        appsAgents: PropTypes.object,
        appsChatrooms: PropTypes.object,
        consumers: PropTypes.object
    }

    static defaultProps = {
        appId: '',
        chatroomId: '',
        platformUid: ''
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.defaultAppId = this.props.appId;
        this.defaultPlatformUid = this.props.platformUid;
        this.defaultAgentUserId = '';
        this.appOptions = this.appsToOptions();
        let consumerOptions = this.consumersToOptions(this.defaultAppId);
        let agentOptions = this.agentsToOptions(this.defaultAppId);

        let appConsumers = this.appsConsumers[this.defaultAppId] || { consumers: {} };
        let consumer = appConsumers.consumers[this.defaultPlatformUid] || {};
        this.state = {
            appId: this.defaultAppId,
            platformUid: this.defaultPlatformUid,
            agentUserId: this.defaultAgentUserId,
            isOpen: this.props.isOpen,
            isProcessing: false,
            consumerOptions: consumerOptions,
            agentOptions: agentOptions,
            messagerEmail: consumer.email || '',
            messagerPhone: consumer.phone || '',
            ticketDescription: ''
        };
        this.ticketStatus = 2;
        this.ticketPriority = 1;

        this.closeModal = this.closeModal.bind(this);
        this.insertTicket = this.insertTicket.bind(this);
        this.appChanged = this.appChanged.bind(this);
        this.consumerChanged = this.consumerChanged.bind(this);
        this.agentChanged = this.agentChanged.bind(this);
        this.statusChanged = this.statusChanged.bind(this);
        this.priorityChanged = this.priorityChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
    }

    appsToOptions() {
        let options = [];

        /** @type {Chatshier.Model.Apps} */
        let apps = this.props.apps || {};
        let firstAppId = this.props.appId;

        this.appsConsumers = {};
        for (let appId in apps) {
            let app = apps[appId];
            if (app.isDeleted || APP_TYPES.CHATSHIER === app.type) {
                continue;
            }

            firstAppId = firstAppId || appId;
            options.push(
                <option key={appId} value={appId}>{app.name}</option>
            );

            this.appsConsumers[appId] = { consumers: {} };
            let chatrooms = this.props.appsChatrooms[appId] ? this.props.appsChatrooms[appId].chatrooms : {};
            for (let chatroomId in chatrooms) {
                if (chatrooms[chatroomId].platformGroupId) {
                    continue;
                }

                let messagers = chatrooms[chatroomId].messagers;
                for (let messagerId in messagers) {
                    let messager = messagers[messagerId];
                    if (APP_TYPES.CHATSHIER === messager.type) {
                        continue;
                    }
                    let consumer = Object.assign({}, this.props.consumers[messager.platformUid]);
                    consumer.phone = messager.phone;
                    consumer.email = messager.email;
                    this.appsConsumers[appId].consumers[messager.platformUid] = consumer;
                }
            }
        }

        this.defaultAppId = firstAppId;
        return options;
    }

    consumersToOptions(appId) {
        let options = [];
        if (!this.appsConsumers[appId]) {
            return options;
        }

        let consumers = this.appsConsumers[appId].consumers;
        let firstPlatformUid = this.props.platformUid;
        for (let platformUid in consumers) {
            let consumer = consumers[platformUid];
            firstPlatformUid = firstPlatformUid || platformUid;
            options.push(
                <option key={platformUid} value={platformUid}>{consumer.name}</option>
            );
        }
        this.defaultPlatformUid = firstPlatformUid;
        return options;
    }

    agentsToOptions(appId) {
        let options = [];
        let appsAgents = this.props.appsAgents;
        if (!(appId && appsAgents[appId])) {
            return options;
        }

        /** @type {Chatshier.Model.Users} */
        let agents = appsAgents[appId].agents;

        let firstAgentUserId = '';
        for (let userId in agents) {
            let consumer = agents[userId];
            firstAgentUserId = firstAgentUserId || userId;
            options.push(
                <option key={userId} value={userId}>{consumer.name}</option>
            );
        }
        this.defaultAgentUserId = firstAgentUserId;
        return options;
    }

    appChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        let selectedAppId = selectedOpt.value;

        let newState = { appId: selectedAppId };
        Object.assign(newState, this.consumerChanged(void 0, selectedAppId));
        Object.assign(newState, this.agentChanged());
        this.setState(newState);
    }

    consumerChanged(ev, appId, platformUid) {
        appId = appId || this.state.appId;
        platformUid = platformUid || this.state.platformUid;

        let newState = {};
        if (ev) {
            let selectedOpt = ev.target.selectedOptions[0];
            newState.platformUid = selectedOpt.value;
        } else {
            newState.consumerOptions = this.consumersToOptions(appId);
            newState.platformUid = platformUid;
        }

        /** @type {Chatshier.Model.Consumer} */
        let consumers = this.appsConsumers[appId].consumers;
        if (newState.platformUid && consumers[platformUid]) {
            let consumer = consumers[platformUid];
            newState.messagerEmail = consumer.email;
            newState.messagerPhone = consumer.phone;
        }
        ev && Object.keys(newState).length > 0 && this.setState(newState);
        return newState;
    }

    agentChanged(ev, appId) {
        appId = appId || this.state.appId;

        let newState = {};
        if (ev) {
            let selectedOpt = ev.target.selectedOptions[0];
            newState.agentUserId = selectedOpt.value;
        } else {
            newState.agentOptions = this.agentsToOptions(appId);
        }
        return newState;
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
        let appId = this.state.appId;
        let platformUid = this.state.platformUid;
        let ticketDescription = this.state.ticketDescription;

        if (!appId) {
            return notify('請選擇機器人', { type: 'warning' });
        } else if (!platformUid) {
            return notify('請選擇目標客戶', { type: 'warning' });
        } else if (!ticketDescription) {
            return notify('請輸入說明內容', { type: 'warning' });
        }

        let ticket = {
            dueTime: Date.now() + (DAY * 3), // 過期時間預設為3天後
            platformUid: platformUid,
            assigned_id: this.state.agentUserId,
            priority: this.ticketPriority,
            status: this.ticketStatus,
            description: ticketDescription
        };

        this.setState({ isProcessing: true });
        return apiDatabase.appsTickets.insert(appId, ticket).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            let agent = this.props.appsAgents[appId].agents[ticket.assigned_id];
            return notify('待辦事項已新增，指派人: ' + agent.name, { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('待辦事項新增失敗', { type: 'danger' });
        });
    }

    render() {
        return (
            <Modal className="ticket-insert-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>新增待辦事項</ModalHeader>
                <ModalBody>
                    <div className="ticket-content">
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">目標機器人:</label>
                            <select className="form-control" onChange={this.appChanged}>
                                {this.appOptions}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">客戶姓名:</label>
                            <select className="form-control" onChange={this.consumerChanged}>
                                {this.state.consumerOptions}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">客戶ID:</label>
                            <input type="text" className="form-control" value={this.state.platformUid} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">電子郵件:</label>
                            <input type="text" className="form-control" value={this.state.messagerEmail} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">手機:</label>
                            <input type="text" className="form-control" value={this.state.messagerPhone} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">指派人:</label>
                            <select className="form-control" onChange={this.agentChanged}>
                                {this.state.agentOptions}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">優先度:</label>
                            <select className="form-control" onChange={this.priorityChanged}>
                                <option value="1">低</option>
                                <option value="2">中</option>
                                <option value="3">高</option>
                                <option value="4">急</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">處理狀態:</label>
                            <select className="form-control" onChange={this.statusChanged}>
                                <option value="2">未處理</option>
                                <option value="3">處理中</option>
                                <option value="4">已處理</option>
                                <option value="5">已關閉</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">內容:</label>
                            <textarea
                                className="form-control"
                                placeholder={this.props.t('Fill the description')}
                                rows="3"
                                value={this.ticketDescription}
                                onChange={this.descriptionChanged}>
                            </textarea>
                        </FormGroup>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.insertTicket} disabled={this.state.isProcessing}>新增</Button>
                    <Button color="secondary" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(TicketInsertModal);
