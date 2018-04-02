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
            status: null,
            fields: null,
            isAsyncWorking: false
        };

        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleFieldButtonChange = this.handleFieldButtonChange.bind(this);
        this.handleFieldInputChange = this.handleFieldInputChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.updateCompose = this.updateCompose.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let compose = nextProps.modalData ? nextProps.modalData.compose : {};
        let composeLength = Object.keys(compose).length;
        let fields = {};
        let appsFields = nextProps.modalData ? nextProps.modalData.appsFields.fields : {};
        if (0 < composeLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                composeId: nextProps.modalData.composeId,
                time: compose.time,
                ageRange: compose.ageRange || '',
                gender: compose.gender || '',
                text: compose.text,
                status: compose.status
            });
        }
        Promise.resolve().then(() => {
            return Object.keys(appsFields).filter((field) => 'Age' === appsFields[field].text || 'Gender' === appsFields[field].text || 'CUSTOM' === appsFields[field].type);
        }).then((fieldArray) => {
            fieldArray.map((field) => {
                switch (appsFields[field].text) {
                    case 'Age':
                        fields[field] = {
                            id: appsFields[field]._id,
                            name: appsFields[field].text,
                            isSelected: false,
                            value: compose.ageRange[0] || ''
                        };
                        break;
                    case 'Gender':
                        fields[field] = {
                            id: appsFields[field]._id,
                            name: appsFields[field].text,
                            isSelected: false,
                            value: compose.gender
                        };
                        break;
                    default:
                        fields[field] = {
                            id: appsFields[field]._id,
                            name: appsFields[field].text,
                            isSelected: false,
                            value: compose.field_ids[field] ? compose.field_ids[field].value : ''
                        };
                }
            });
            return fields;
        }).then((fields) => {
            this.setState({
                fields
            });
        });
    }
    handleDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({time: timeInMs});
    }
    handleDraftChange(event) {
        let status = !this.state.status;
        this.setState({ status });
    }
    handleFieldButtonChange(event) {
        let key = event.target.getAttribute('name');
        let className = event.target.getAttribute('class');
        let fields = this.state.fields;
        fields[key].isSelected = !this.state.fields[key].isSelected;
        if (className.includes('btn-danger') || className.includes('fa-times')) {
            fields[key].value = '';
        }
        this.setState({fields});
    }
    handleFieldInputChange(event) {
        let key = event.target.getAttribute('name');
        let fields = this.state.fields;
        fields[key].value = event.target.value;
        this.setState({ fields });
    }
    handleTextChange(event) {
        this.setState({text: event.target.value});
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
        let field_ids = {};
        let age, gender;
        Object.values(this.state.fields).map((field) => {
            if (!field.value) {
                return;
            }
            field_ids[field.id] = {
                value: field.value
            };
            age = 'Age' === field.name ? field.value : '';
            gender = 'Gender' === field.name ? field.value : '';
        });
        let compose = {
            type: 'text',
            text: this.state.text,
            time: this.state.time,
            status: this.state.status,
            ageRange: [].concat(age),
            gender: gender,
            field_ids
        };
        return dbapi.appsComposes.update(appId, composeId, userId, compose).then(() => {
            this.props.close(event);
            return notify('修改成功', { type: 'success' });
        }).catch(() => {
            return notify('修改失敗', { type: 'danger' });
        }).then(() => {
            this.setState({ isAsyncWorking: false });
        });
    }
    renderFilter() {
        let appsFields = this.state.fields ? Object.values(this.state.fields) : [];
        if (0 >= appsFields.length) { return null; }
        return appsFields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col>
                        <Button color="secondary" disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())} name={field.id} onClick={this.handleFieldButtonChange}>
                            {field.value ? `${field.name} : ${field.value}` : field.name}
                        </Button>
                        <FormGroup>
                            <Row>
                                <Col>
                                    <Input type="text" name={field.id} defaultValue={this.state.fields[field.id].value} onChange={this.handleFieldInputChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}/>
                                </Col>
                                <Col>
                                    <Button color="success" name={field.id} onClick={this.handleFieldButtonChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}><i className="fas fa-check" name={field.id}></i></Button>{' '}
                                    <Button color="danger" name={field.id} onClick={this.handleFieldButtonChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}><i className="fas fa-times" name={field.id}></i></Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
            );
        });
    }
    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    時間：
                    <DateTimePicker defaultValue={new Date(this.state.time)} onChange={this.handleDatetimeChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}></DateTimePicker>
                    <div className="panel panel-default">
                        <div className="panel-heading">條件</div>
                        <div className="panel-body">
                            { this.renderFilter() }
                        </div>
                    </div>
                    <div>
                        內容：
                        <Input type="textarea" defaultValue={this.state.text} onChange={this.handleTextChange} disabled={this.state.status && timeHelper.isHistory(this.state.time, Date.now())} />
                    </div>
                    <FormGroup check hidden={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}>
                        <Label check>
                            <Input type="checkbox" defaultChecked={!this.state.status} onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateCompose} disabled={this.state.isAsyncWorking} hidden={this.state.status && timeHelper.isHistory(this.state.time, Date.now())}>修改</Button>{' '}
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
