import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody,
    ModalFooter, Form, FormGroup, Label,
    Input, Card, CardHeader, CardBody,
    Dropdown, DropdownToggle } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import apiDatabase from '../../../helpers/apiDatabase/index';
import timeHlp from '../../../helpers/timer';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';

class ComposeInsertModal extends ModalCore {
    static propTypes = {
        apps: PropTypes.object.isRequired,
        appsFields: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            time: '',
            status: true,
            radioTime: {
                NOW: true,
                LATER: false
            },
            count: 0,
            fields: null,
            composeTexts: [''],
            isAsyncProcessing: false
        };

        this.NOW = 'NOW';
        this.LATER = 'LATER';
        this.CUSTOM = 'CUSTOM';

        this.selectedApp = this.selectedApp.bind(this);
        this.onAddText = this.onAddText.bind(this);
        this.onDatetimeChange = this.onDatetimeChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.insertCompose = this.insertCompose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let appId = Object.keys(nextProps.apps)[0];
        let appsFields = nextProps.appsFields[appId] ? nextProps.appsFields[appId].fields : {};
        let appIds = Object.keys(appsFields).filter((appId) => {
            return 'Age' === appsFields[appId].text ||
                'Gender' === appsFields[appId].text ||
                'CUSTOM' === appsFields[appId].type;
        });

        let _appsFields = appIds.reduce((output, appId) => {
            output[appId] = {
                id: appsFields[appId]._id,
                name: appsFields[appId].text,
                isSelected: false,
                value: ''
            };
            return output;
        }, {});

        this.setState({
            appId: appId,
            fields: _appsFields
        });
    }

    selectedApp(event) {
        this.setState({appId: event.target.value});
    }

    onDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({time: timeInMs});
    }

    onAddText() {
        let composeTexts = this.state.composeTexts;
        if (composeTexts.length >= 3) {
            return;
        }
        composeTexts.push('');
        this.setState({ composeTexts: composeTexts });
    }

    onRemoveText(i) {
        let composeTexts = this.state.composeTexts;
        composeTexts.splice(i, 1);
        this.setState({ composeTexts: composeTexts });
    }

    onTextChange(ev, i) {
        let composeTexts = this.state.composeTexts;
        composeTexts[i] = ev.target.value;
        this.setState({ composeTexts: composeTexts });
    }

    timeChanged(time) {
        if (this.NOW === time) {
            this.setState({ time: '' });
        }
        let radioTime = {
            NOW: false,
            LATER: false
        };
        radioTime[time] = true;
        this.setState({ radioTime });
    }

    insertCompose(ev) {
        if (!this.state.text1) {
            return notify('請輸入要送出的訊息', { type: 'warning' });
        } else if (Date.now() > timeHlp.toMilliseconds(this.state.time)) {
            return notify('不能選擇過去的時間', { type: 'warning' });
        }

        let appId = this.state.appId;
        let texts = [];

        switch (this.state.count) {
            case 1:
                texts = [this.state.text1];
                break;
            case 2:
                texts = [this.state.text1, this.state.text2];
                break;
            default:
                texts = [this.state.text1, this.state.text2, this.state.text3];
        }

        let fieldIds = {};
        let ageRange = '';
        let gender = '';
        let time = Date.now() >= this.state.time ? Date.now() : this.state.time;

        Object.values(this.state.fields).forEach((field) => {
            switch (field.name) {
                case 'Age':
                    ageRange = '' === this.state.fields[field.id].value ? '' : this.state.fields[field.id].value;
                    break;
                case 'Gender':
                    gender += this.state.fields[field.id].value;
                    break;
                default:
                    fieldIds[field.id] = {
                        value: field.value
                    };
            }
        });

        let composes = texts.map((text) => {
            let compose = {
                type: 'text',
                text: text,
                time,
                status: this.state.status,
                ageRange,
                gender,
                field_ids: fieldIds
            };
            return compose;
        });

        let nextCompose = (i) => {
            if (i >= composes.length) {
                return Promise.resolve();
            }

            let compose = composes[i];
            return apiDatabase.appsComposes.insert(appId, compose).then(() => {
                return nextCompose(i + 1);
            });
        };

        this.setState({ isAsyncProcessing: true });
        return nextCompose(0).then(() => {
            this.setState({
                isOpen: false,
                isAsyncProcessing: false
            });
            return notify('新增成功', { type: 'success' });
        }).then(() => {
            return this.closeModal(ev);
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify('新增失敗', { type: 'danger' });
        });
    }

    renderTextareas() {
        let composeTexts = this.state.composeTexts;

        return composeTexts.map((text, i) => (
            <FormGroup key={i} className="w-100 input-warpper">
                <div className="position-relative input-container">
                    {i > 0 && <span className="remove-btn" onClick={() => this.onRemoveText(i)}>刪除</span>}
                    <Input className="w-100 px-2 compose-textarea text-input"
                        type="textarea"
                        name="composeTexts"
                        defaultValue={text}
                        placeholder="輸入文字..."
                        onChange={(ev) => this.onTextChange(ev, i)} />
                </div>
            </FormGroup>
        ));
    }

    render() {
        return (
            <Modal className="compose-modal" isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}></ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <label className="col-form-label font-weight-bold">聊天機器人:</label>
                        <Dropdown isOpen toggle={() => {}}>
                            <DropdownToggle className="btn-block btn-border" color="light" block caret>
                                <span className="dropdown-value">已選擇的機器人 (0)</span>
                            </DropdownToggle>
                            <Form className="px-2 dropdown-menu dropdown-menu-right"></Form>
                        </Dropdown>
                    </FormGroup>

                    <Card>
                        <CardHeader>
                            <span>發送條件</span>
                            <small className="mx-1 text-info d-none"></small>
                        </CardHeader>
                        <CardBody>
                            <div className="condition-container"></div>
                            <Button className="condition-add-btn" color="light">
                                <i className="fas fa-plus fa-fw"></i>
                                <span>新增發送條件</span>
                            </Button>
                        </CardBody>
                    </Card>

                    <FormGroup>
                        <Label>設定傳送時間: </Label>
                        <FormGroup check className="my-1">
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.NOW} onChange={() => this.timeChanged(this.NOW)} />{' '}
                                立刻傳送
                            </Label>
                        </FormGroup>
                        <FormGroup check className="my-1">
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.LATER} onChange={() => this.timeChanged(this.LATER)} />{' '}
                                傳送時間
                            </Label>
                        </FormGroup>
                        <DateTimePicker onChange={this.handleDatetimeChange} disabled={!this.state.radioTime.LATER}></DateTimePicker>
                    </FormGroup>

                    <FormGroup>
                        <label className="col-form-label font-weight-bold mb-2">內容: </label>
                        <Button className="mx-2 btn-border insert" color="light" onClick={this.onAddText}>
                            <i className="fas fa-plus"></i>
                        </Button>
                        <span>(一次最多 3 則)</span>
                        {this.renderTextareas()}
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.insertCompose} disabled={this.state.isAsyncProcessing}>新增</Button>
                    <Button outline color="info" disabled={this.state.isAsyncProcessing}>存為草稿</Button>
                    <Button outline color="danger" onClick={this.closeModal}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ComposeInsertModal;
