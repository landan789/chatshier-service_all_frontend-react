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
        this.selectedMessagerId = '';
        this.appOptions = this.appsToOptions();

        this.state = {
            messagerOptions: this.appsMessagersToOptions(),
            messagerId: '',
            messagerEmail: '',
            messagerPhone: '',
            ticketDescription: ''
        };
        this.ticketStatus = 2;
        this.ticketPriority = 1;

        this.insertTicket = this.insertTicket.bind(this);
        this.appChanged = this.appChanged.bind(this);
        this.messagerChanged = this.messagerChanged.bind(this);
        this.statusChanged = this.statusChanged.bind(this);
        this.priorityChanged = this.priorityChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
    }

    componentWillReceiveProps() {
        this.appOptions = this.appsToOptions();
        this.messagerChanged();
    }

    appsToOptions() {
        let options = [];
        let apps = this.props.apps || {};
        let firstAppId;

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

    appsMessagersToOptions() {
        let options = [];
        let appsMessagers = this.props.appsMessagers || {};

        if (this.selectedAppId && appsMessagers[this.selectedAppId]) {
            let messagers = appsMessagers[this.selectedAppId].messagers;

            let firstMessagerId;
            for (let messagerId in messagers) {
                let messager = messagers[messagerId];
                firstMessagerId = firstMessagerId || messagerId;
                options.push(
                    <option key={messagerId} value={messagerId}>{messager.name}</option>
                );
            }
            this.selectedMessagerId = firstMessagerId;
        }
        return options;
    }

    appChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.selectedAppId = selectedOpt.value;
        this.messagerChanged();
    }

    messagerChanged(ev) {
        let newState = {};
        if (ev) {
            let selectedOpt = ev.target.selectedOptions[0];
            this.selectedMessagerId = selectedOpt.value;
        } else {
            newState.messagerOptions = this.appsMessagersToOptions();
        }

        let appId = this.selectedAppId;
        let appsMessagers = this.props.appsMessagers || {};

        if (appId && appsMessagers[appId]) {
            let messagerId = this.selectedMessagerId;
            let messager = appsMessagers[appId].messagers[messagerId];
            newState.messagerId = messagerId;
            newState.messagerEmail = messager.email;
            newState.messagerPhone = messager.phone;
        }
        Object.keys(newState).length > 0 && this.setState(newState);
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
        } else if (!this.selectedMessagerId) {
            return notify('請選擇目標客戶', { type: 'warning' });
        } else if (!this.state.ticketDescription) {
            return notify('請輸入說明內容', { type: 'warning' });
        }

        let appId = this.selectedAppId;
        let userId = authHelper.userId;
        let ticket = {
            dueTime: Date.now() + (DAY * 3), // 過期時間預設為3天後
            messager_id: this.selectedMessagerId,
            priority: this.ticketPriority,
            status: this.ticketStatus,
            description: this.state.ticketDescription
        };

        return dbapi.appsTickets.insert(appId, userId, ticket).then((resJson) => {
            let appsTickets = resJson.data;
            let ticketId = Object.keys(appsTickets[appId].tickets).shift();

            let modalData = {
                appId: appId,
                ticketId: ticketId,
                insertedAppsTickets: appsTickets
            };
            this.props.close(ev, 'insert', modalData);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
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
                            <select className="form-control" onChange={this.messagerChanged}>
                                {this.state.messagerOptions}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject" className="col-form-label">客戶ID</label>
                            <input type="text" className="form-control" value={this.state.messagerId} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-form-label">電子郵件</label>
                            <input type="text" className="form-control" value={this.state.messagerEmail} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="col-form-label">手機</label>
                            <input type="text" className="form-control" value={this.state.messagerPhone} readOnly />
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
                        {/* <div class="form-group">
                            <label>負責人</label>
                            <select class="form-control">
                                <option value="未指定">請選擇</option>
                            </select>
                        </div> */}
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
                    <Button color="primary" onClick={this.insertTicket}>新增</Button>
                    <Button color="secondary" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TicketInsertModal.propTypes = {
    apps: PropTypes.object,
    appsMessagers: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func
};

export default TicketInsertModal;
