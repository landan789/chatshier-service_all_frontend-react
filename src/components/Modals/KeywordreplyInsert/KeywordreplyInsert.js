import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

class KeywordreplyInsert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            keyword: '',
            text: '',
            status: false,
            isAsyncWorking: false
        };

        this.handleAppChange = this.handleAppChange.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.insertKeywordreply = this.insertKeywordreply.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let firstApp = Object.keys(nextProps.apps)[0];
        this.setState({appId: firstApp});
    }
    handleAppChange(event) {
        this.setState({appId: event.target.value});
    }
    handleKeywordChange(event) {
        this.setState({ keyword: event.target.value });
    }
    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }
    handleDraftChange(event) {
        this.setState({ status: event.target.checked });
    }
    insertKeywordreply(event) {
        if (!this.state.keyword) {
            return notify('請輸入關鍵字', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入回覆訊息', { type: 'warning' });
        }

        this.setState({ isAsyncWorking: true });

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

        return dbapi.appsKeywordreplies.insert(appId, userId, keywordreply).then(() => {
            this.props.close(event);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
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
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    新增關鍵字回覆
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Apps: </Label>
                        <Input type="select" onChange={this.handleAppChange}>
                            { this.renderApps() }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>關鍵字： </Label>
                        <Input type="text" onChange={this.handleKeywordChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>回覆內容: </Label>
                        <Input type="textarea" onChange={this.handleTextChange}/>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.insertKeywordreply} disabled={this.state.isAsyncWorking}>新增</Button>{' '}
                    <Button outline color="danger" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

KeywordreplyInsert.propTypes = {
    apps: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default KeywordreplyInsert;
