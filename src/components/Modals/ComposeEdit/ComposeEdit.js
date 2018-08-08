import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import apiDatabase from '../../../helpers/apiDatabase/index';
import timeHlp from '../../../helpers/timer';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class ComposeEditModal extends ModalCore {
    static propTypes = {
        modalData: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            isAsyncProcessing: false,
            appId: '',
            composeId: '',
            time: '',
            ageRange: '',
            gender: '',
            field_ids: null,
            text: '',
            status: null,
            fields: null
        };

        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleFieldButtonChange = this.handleFieldButtonChange.bind(this);
        this.handleFieldInputChange = this.handleFieldInputChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.updateCompose = this.updateCompose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let compose = nextProps.modalData ? nextProps.modalData.compose : {};
        let composeLength = Object.keys(compose).length;

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

        let appIds = Object.keys(appsFields).filter((appId) => {
            return 'Age' === appsFields[appId].text ||
                'Gender' === appsFields[appId].text ||
                'CUSTOM' === appsFields[appId].type;
        });

        let _appsFields = appIds.reduce((output, appId) => {
            switch (appsFields[appId].text) {
                case 'Age':
                    output[appId] = {
                        id: appsFields[appId]._id,
                        name: appsFields[appId].text,
                        isSelected: false,
                        value: compose.ageRange[0] || ''
                    };
                    break;
                case 'Gender':
                    output[appId] = {
                        id: appsFields[appId]._id,
                        name: appsFields[appId].text,
                        isSelected: false,
                        value: compose.gender
                    };
                    break;
                default:
                    output[appId] = {
                        id: appsFields[appId]._id,
                        name: appsFields[appId].text,
                        isSelected: false,
                        value: compose.field_ids[appId] ? compose.field_ids[appId].value : ''
                    };
                    break;
            }
            return output;
        }, {});
        this.setState({ fields: _appsFields });
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

    updateCompose(ev) {
        if (!this.state.time) {
            return notify('請選擇時間', { type: 'warning' });
        } else if (!this.state.text) {
            return notify('請輸入要送出的訊息', { type: 'warning' });
        } else if (Date.now() > timeHlp.toMilliseconds(this.state.time)) {
            return notify('不能選擇過去的時間', { type: 'warning' });
        }

        let appId = this.state.appId;
        let composeId = this.state.composeId;
        let fieldIds = {};
        let age, gender;

        Object.values(this.state.fields).forEach((field) => {
            if (!field.value) {
                return;
            }
            fieldIds[field.id] = {
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
            field_ids: fieldIds
        };

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsComposes.update(appId, composeId, compose).then(() => {
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

    renderFilter() {
        let appsFields = this.state.fields ? Object.values(this.state.fields) : [];
        if (0 >= appsFields.length) { return null; }
        return appsFields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col>
                        <Button color="secondary" disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())} name={field.id} onClick={this.handleFieldButtonChange}>
                            {field.value ? `${field.name} : ${field.value}` : field.name}
                        </Button>
                        <FormGroup>
                            <Row>
                                <Col>
                                    <Input type="text" name={field.id} defaultValue={this.state.fields[field.id].value} onChange={this.handleFieldInputChange} disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}/>
                                </Col>
                                <Col>
                                    <Button color="success" name={field.id} onClick={this.handleFieldButtonChange} disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}><i className="fas fa-check" name={field.id}></i></Button>{' '}
                                    <Button color="danger" name={field.id} onClick={this.handleFieldButtonChange} disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}><i className="fas fa-times" name={field.id}></i></Button>
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
            <Modal className="compose-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}></ModalHeader>
                <ModalBody>
                    時間：
                    <DateTimePicker defaultValue={new Date(this.state.time)} onChange={this.handleDatetimeChange} disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}></DateTimePicker>
                    <div className="panel panel-default">
                        <div className="panel-heading">條件</div>
                        <div className="panel-body">
                            { this.renderFilter() }
                        </div>
                    </div>
                    <div>
                        內容：
                        <Input type="textarea" defaultValue={this.state.text} onChange={this.handleTextChange} disabled={this.state.status && timeHlp.isHistory(this.state.time, Date.now())} />
                    </div>
                    <FormGroup check hidden={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}>
                        <Label check>
                            <Input type="checkbox" defaultChecked={!this.state.status} onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.updateCompose} disabled={this.state.isAsyncProcessing} hidden={this.state.status && timeHlp.isHistory(this.state.time, Date.now())}>修改</Button>{' '}
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ComposeEditModal;
