import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class KeywordreplyInsertModal extends ModalCore {
    static propTypes = {
        apps: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen,
            isAsyncWorking: false,
            appId: '',
            keyword: '',
            text: '',
            status: false
        };

        this.handleAppChange = this.handleAppChange.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.insertKeywordreply = this.insertKeywordreply.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let firstApp = Object.keys(nextProps.apps)[0];
        this.setState({appId: firstApp});
    }

    handleAppChange(ev) {
        this.setState({appId: ev.target.value});
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

    insertKeywordreply(ev) {
        if (!this.state.keyword) {
            return notify('請輸入關鍵字', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入回覆訊息', { type: 'warning' });
        }

        let appId = this.state.appId;
        let userId = authHelper.userId;
        let keywordreply = {
            createdTime: Date.now(),
            isDeleted: 0,
            keyword: this.state.keyword,
            replyCount: 0,
            status: this.state.status ? 0 : 1,
            subKeywords: '',
            text: this.state.text,
            type: 'text',
            updatedTime: Date.now()
        };

        this.setState({ isAsyncWorking: true });
        return apiDatabase.appsKeywordreplies.insert(appId, userId, keywordreply).then(() => {
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

    renderApps() {
        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);

        return appIds.map((appId) => {
            let app = apps[appId];
            if ('CHATSHIER' === app.type) {
                return null;
            }

            return (
                <option key={appId} value={appId}>{apps[appId].name}</option>
            );
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
                        <Label>Apps:</Label>
                        <Input type="select" onChange={this.handleAppChange}>
                            { this.renderApps() }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>關鍵字:</Label>
                        <Input type="text" onChange={this.handleKeywordChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>回覆內容:</Label>
                        <Input type="textarea" onChange={this.handleTextChange}/>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleDraftChange} />
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.insertKeywordreply} disabled={this.state.isAsyncWorking}>新增</Button>
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default KeywordreplyInsertModal;
