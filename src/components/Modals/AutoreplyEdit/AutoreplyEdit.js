import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, InputGroup, Input } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import apiDatabase from '../../../helpers/apiDatabase/index';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class AutoreplyEditModal extends ModalCore {
    static propTypes = {
        modalData: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            appId: '',
            autoreplyId: '',
            title: '',
            startedTime: '',
            endedTime: '',
            text: '',
            isAsyncProcessing: false
        };

        this.updateAutoreply = this.updateAutoreply.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStartDatetimeChange = this.handleStartDatetimeChange.bind(this);
        this.handleEndDatetimeChange = this.handleEndDatetimeChange.bind(this);
        this.selectedApp = this.selectedApp.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let autoreply = nextProps.modalData ? nextProps.modalData.autoreply : {};
        let autoreplyLength = Object.keys(autoreply).length;
        if (0 < autoreplyLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                autoreplyId: nextProps.modalData.autoreplyId,
                title: autoreply.title,
                startedTime: autoreply.startedTime,
                endedTime: autoreply.endedTime,
                text: autoreply.text
            });
        }
    }
    updateAutoreply(ev) {
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

        let appId = this.state.appId;
        let autoreplyId = this.state.autoreplyId;
        let autoreply = {
            endedTime: this.state.endedTime,
            startedTime: this.state.startedTime,
            text: this.state.text,
            title: this.state.title,
            updatedTime: Date.now()
        };

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsAutoreplies.update(appId, autoreplyId, autoreply).then(() => {
            this.setState({
                isOpen: false,
                isAsyncProcessing: false
            });
            return notify('修改成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify('修改失敗', { type: 'danger' });
        });
    }
    selectedApp(event) {
        this.setState({appId: event.target.value});
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
    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    修改自動回覆訊息
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>事件名稱(不可重複): </Label>
                        <Input type="text" value={this.state.title} onChange={this.handleTitleChange}/>
                    </FormGroup>
                    <InputGroup>
                        <Label>開始時間 </Label>
                        <DateTimePicker defaultValue={new Date(this.state.startedTime)} onChange={this.handleStartDatetimeChange}></DateTimePicker>
                        <Label>結束時間 </Label>
                        <DateTimePicker defaultValue={new Date(this.state.endedTime)} onChange={this.handleEndDatetimeChange}></DateTimePicker>
                    </InputGroup>

                    <FormGroup>
                        <Label>自動回覆訊息: </Label>
                        <Input type="textarea" value={this.state.text} onChange={this.handleDescriptionChange}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateAutoreply} disabled={this.state.isAsyncProcessing}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default AutoreplyEditModal;
