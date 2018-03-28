import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import timeHelper from '../../../helpers/timer';
import { notify } from '../../Notify/Notify';

class ComposeEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            composeId: '',
            time: '',
            ageRange: '',
            gender: '',
            field_ids: null,
            text: '',
            status: false,
            isAsyncWorking: false
        };

        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.clearAgeText = this.clearAgeText.bind(this);
        this.clearGenderText = this.clearGenderText.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let compose = nextProps.modalData ? nextProps.modalData.compose : {};
        let composeLength = Object.keys(compose).length;
        if (0 < composeLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                composeId: nextProps.modalData.composeId,
                time: compose.time,
                ageRange: compose.ageRange || '',
                gender: compose.gender || '',
                field_ids: compose.field_ids || {},
                text: compose.text,
                status: compose.status
            });
        }
    }
    handleDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({time: timeInMs});
    }
    handleTextChange(event) {
        let index = event.target.getAttribute('name');
        let messages = this.state.messages[index];
        messages.text = event.target.value;
    }
    handleDraftChange(event) {
        this.setState({ status: event.target.checked });
    }
    handleAgeChange(event) {
        this.setState({ageRange: event.target.value});
    }
    handleGenderChange(event) {
        this.setState({gender: event.target.value});
    }
    clearAgeText(event) {
        this.setState({ageRange: ''});
    }
    clearGenderText(event) {
        this.setState({gender: ''});
    }
    updateCompose(event) {
        if (!this.state.time) {
            return notify('請選擇時間', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入要送出的訊息', { type: 'warning' });
        } else if (Date.now() > timeHelper.toMilliseconds(this.state.time)) {
            return notify('不能選擇過去的時間', { type: 'warning' });
        }

        this.setState({ isAsyncWorking: true });

        let appId = this.state.appId;
        let composeId = this.state.composeId;
        let userId = authHelper.userId;
        let compose = {
            type: 'text',
            text: this.state.text,
            time: this.state.time,
            status: this.state.status,
            ageRange: this.state.ageRange,
            gender: this.state.gender,
            field_ids: this.state.field_ids
        };
        return dbapi.appsComposes.update(appId, composeId, userId, compose).then(() => {
            this.props.close(event);
            return notify('新增成功', { type: 'success' });
        }).catch(() => {
            return notify('新增失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }
    renderFilter() {
        // let appsTags = this.props.appsTags || {};
        return (
            <Row>
                <Col>
                    <Button color="secondary">自訂</Button>
                    <FormGroup>
                        <Row>
                            <Col>
                                <Input type="text" />
                            </Col>
                            <Col>
                                <Button color="danger"><i className="fas fa-times"></i></Button>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    時間：
                    <DateTimePicker defaultValue={new Date(this.state.time)} onChange={this.handleDatetimeChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}></DateTimePicker>
                    <div className="panel panel-default" hidden={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}>
                        <div className="panel-heading">條件</div>
                        <div className="panel-body">
                            <Row>
                                <Col>
                                    <Button color="secondary">年齡</Button>
                                    <FormGroup>
                                        <Row>
                                            <Col>
                                                <Input type="text" defaultValue={this.state.ageRange || ''} onChange={this.handleAgeChange} />
                                            </Col>
                                            <Col>
                                                <Button color="danger" onClick={this.clearAgeText}><i className="fas fa-times"></i></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <Button color="secondary">性別</Button>
                                    <FormGroup>
                                        <Row>
                                            <Col>
                                                <Input type="text" defaultValue={this.state.gender || ''} onChange={this.handleGenderChange} />
                                            </Col>
                                            <Col>
                                                <Button color="danger" onClick={this.clearGenderText}><i className="fas fa-times"></i></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                            </Row>
                            { this.renderFilter() }
                        </div>
                    </div>
                    <div>
                        內容：
                        <Input type="textarea" defaultValue={this.state.text} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())} />
                    </div>
                    <FormGroup check hidden={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}>
                        <Label check>
                            <Input type="checkbox" checked={!this.state.status} onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" disabled={this.state.isAsyncWorking} hidden={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ComposeEdit.propTypes = {
    modalData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default ComposeEdit;
