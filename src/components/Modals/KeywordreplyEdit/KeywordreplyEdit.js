import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class KeywordreplyEditModal extends ModalCore {
    static propTypes = {
        modalData: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            isAsyncWorking: false,
            appId: '',
            keywordreplyId: '',
            keyword: '',
            text: '',
            status: false
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.updateKeywordreply = this.updateKeywordreply.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let keywordreply = nextProps.modalData ? nextProps.modalData.keywordreply : {};
        let keywordreplyLength = Object.keys(keywordreply).length;
        if (0 < keywordreplyLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                keywordreplyId: nextProps.modalData.keywordreplyId,
                keyword: keywordreply.keyword,
                text: keywordreply.text,
                status: 0 === keywordreply.status
            });
        }
    }
    handleKeywordChange(ev) {
        this.setState({ keyword: ev.target.value });
    }
    handleTextChange(ev) {
        this.setState({ text: ev.target.value });
    }
    handleDraftChange(ev) {
        this.setState({ status: ev.target.checked });
    }
    updateKeywordreply(ev) {
        if (!this.state.keyword) {
            return notify('請輸入關鍵字', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入回覆訊息', { type: 'warning' });
        }

        let appId = this.state.appId;
        let keywordreplyId = this.state.keywordreplyId;
        let userId = authHelper.userId;
        let keywordreply = {
            keyword: this.state.keyword,
            status: this.state.status ? 0 : 1,
            text: this.state.text,
            updatedTime: Date.now()
        };

        this.setState({ isAsyncWorking: true });
        return apiDatabase.appsKeywordreplies.update(appId, keywordreplyId, userId, keywordreply).then(() => {
            this.setState({
                isOpen: false,
                isAsyncWorking: false
            });
            return notify('新增成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncWorking: false });
            return notify('新增失敗', { type: 'danger' });
        });
    }
    render() {
        return (
            <Modal size="lg" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    新增關鍵字回覆
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>關鍵字： </Label>
                        <Input type="text" value={this.state.keyword} onChange={this.handleKeywordChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>回覆內容: </Label>
                        <Input type="textarea" value={this.state.text} onChange={this.handleTextChange}/>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" checked={this.state.status} onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateKeywordreply} disabled={this.state.isAsyncWorking}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default KeywordreplyEditModal;
