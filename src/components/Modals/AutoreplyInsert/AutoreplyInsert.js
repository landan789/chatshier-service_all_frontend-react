import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, InputGroup } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class AutoreplyInsertModal extends ModalCore {
    static propTypes = {
        apps: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            appId: '',
            title: '',
            startedTime: '',
            endedTime: '',
            text: '',
            isAsyncWorking: false
        };

        this.insertAutoreply = this.insertAutoreply.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStartDatetimeChange = this.handleStartDatetimeChange.bind(this);
        this.handleEndDatetimeChange = this.handleEndDatetimeChange.bind(this);
        this.selectedApp = this.selectedApp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let firstApp = Object.keys(nextProps.apps)[0];
        this.setState({appId: firstApp});
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleDescriptionChange(event) {
        this.setState({text: event.target.value});
    }

    handleStartDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({startedTime: timeInMs});
    }

    handleEndDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({endedTime: timeInMs});
    }

    insertAutoreply(event) {
        if (!this.state.title) {
            return notify('請輸入事件名稱', { type: 'warning' });
        } else if (!this.state.startedTime) {
            return notify('請設定開始日期', { type: 'warning' });
        } else if (!this.state.endedTime) {
            return notify('請設定結束日期', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入回覆訊息', { type: 'warning' });
        } else if (this.state.endedTime <= this.state.startedTime) {
            return notify('開始時間不能比結束時間晚', { type: 'warning' });
        }
        this.setState({ isAsyncWorking: true });

        let appId = this.state.appId;
        let userId = authHelper.userId;
        let autoreply = {
            createdTime: Date.now(),
            endedTime: this.state.endedTime,
            isDeleted: 0,
            startedTime: this.state.startedTime,
            text: this.state.text,
            title: this.state.title,
            type: 'text',
            updatedTime: Date.now()
        };

        return apiDatabase.appsAutoreplies.insert(appId, userId, autoreply).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify('新增成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(event);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify('新增失敗', { type: 'danger' });
        });
    }

    selectedApp(event) {
        this.setState({appId: event.target.value});
    }

    renderApps() {
        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);

        return appIds.map((appId) => {
            let app = apps[appId];
            if ('CHATSHIER' === app.type) {
                return null;
            }

            return (
                <option key={appId} value={appId}>{apps[appId].name}
                </option>
            );
        });
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    新增自動回覆訊息
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Apps: </Label>
                        <Input type="select" onChange={this.selectedApp}>
                            { this.renderApps() }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>事件名稱(不可重複): </Label>
                        <Input type="text" onChange={this.handleTitleChange}/>
                    </FormGroup>
                    <InputGroup>
                        <Label>開始時間 </Label>
                        <DateTimePicker onChange={this.handleStartDatetimeChange}></DateTimePicker>
                        <Label>結束時間 </Label>
                        <DateTimePicker onChange={this.handleEndDatetimeChange}></DateTimePicker>
                    </InputGroup>
                    <br/>
                    <FormGroup>
                        <Label>自動回覆訊息: </Label>
                        <Input type="textarea" onChange={this.handleDescriptionChange}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.insertAutoreply} disabled={this.state.isAsyncWorking}>新增</Button>{' '}
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default AutoreplyInsertModal;
