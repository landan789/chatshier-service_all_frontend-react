import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import { notify } from '../../Notify/Notify';

class KeywordreplyEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            keywordreplyId: '',
            keyword: '',
            text: '',
            draft: false,
            isAsyncWorking: false
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.updateKeywordreply = this.updateKeywordreply.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let keywordreply = nextProps.modalData ? nextProps.modalData.keywordreply : {};
        let keywordreplyLength = Object.keys(keywordreply).length;
        if (0 < keywordreplyLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                keywordreplyId: nextProps.modalData.keywordreplyId,
                keyword: keywordreply.keyword,
                text: keywordreply.text,
                draft: 0 === keywordreply.status
            });
        }
    }
    handleKeywordChange(event) {
        this.setState({ keyword: event.target.value });
    }
    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }
    handleDraftChange(event) {
        this.setState({ draft: event.target.checked });
    }
    updateKeywordreply(event) {
        if (!this.state.keyword) {
            return notify('請輸入關鍵字', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入回覆訊息', { type: 'warning' });
        }

        this.setState({ isAsyncWorking: true });

        let appId = this.state.appId;
        let keywordreplyId = this.state.keywordreplyId;
        let userId = authHelper.userId;
        let keywordreply = {
            keyword: this.state.keyword,
            status: false === this.state.draft ? 1 : 0,
            text: this.state.text,
            updatedTime: Date.now()
        };

        return dbapi.appsKeywordreplies.update(appId, keywordreplyId, userId, keywordreply).then(() => {
            this.props.close(event);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
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
                        <Label>關鍵字： </Label>
                        <Input type="text" value={this.state.keyword} onChange={this.handleKeywordChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>回覆內容: </Label>
                        <Input type="textarea" value={this.state.text} onChange={this.handleTextChange}/>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" checked={this.state.draft} onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateKeywordreply} disabled={this.state.isAsyncWorking}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

KeywordreplyEdit.propTypes = {
    modalData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default KeywordreplyEdit;
