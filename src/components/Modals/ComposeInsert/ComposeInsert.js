import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col, Table } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

import dbapi from '../../../helpers/databaseApi/index';
import authHelper from '../../../helpers/authentication';
import timeHelper from '../../../helpers/timer';
import { notify } from '../../Notify/Notify';

class ComposeInsert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            time: '',
            status: true,
            radioCategory: {
                ALL: true,
                ONE: false
            },
            radioTime: {
                NOW: true,
                LATER: false
            },
            count: 0,
            fields: null,
            text1: '',
            text2: '',
            text3: '',
            isAsyncWorking: false
        };

        this.PLUS = 'PLUS';
        this.MINUS = 'MINUS';
        this.ALL = 'ALL';
        this.ONE = 'ONE';
        this.NOW = 'NOW';
        this.LATER = 'LATER';
        this.CUSTOM = 'CUSTOM';

        this.selectedApp = this.selectedApp.bind(this);
        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertCompose = this.insertCompose.bind(this);
        this.handleFieldButtonChange = this.handleFieldButtonChange.bind(this);
        this.handleFieldInputChange = this.handleFieldInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let appId = Object.keys(nextProps.apps)[0];
        let fields = {};
        let appsFields = nextProps.appsFields[appId] ? nextProps.appsFields[appId].fields : {};
        Promise.resolve().then(() => {
            return Object.keys(appsFields).filter((field) => 'Age' === appsFields[field].text || 'Gender' === appsFields[field].text || 'CUSTOM' === appsFields[field].type);
        }).then((fieldArray) => {
            fieldArray.map((field) => {
                fields[field] = {
                    id: appsFields[field]._id,
                    name: appsFields[field].text,
                    isSelected: false,
                    value: ''
                };
            });
            return fields;
        }).then((fields) => {
            this.setState({
                appId,
                fields
            });
        });
    }
    selectedApp(event) {
        this.setState({appId: event.target.value});
    }
    handleDatetimeChange(time) {
        let datetime = new Date(time);
        let timeInMs = datetime.getTime();
        this.setState({time: timeInMs});
    }
    handleDraftChange(event) {
        let result = !this.state.status;
        this.setState({ status: result });
    }
    handleCountChange(operator) {
        let count = this.PLUS === operator ? this.state.count + 1 : this.state.count - 1;
        if (3 >= count) {
            this.setState({ count });
        } else {
            this.setState({ count: 3 });
        }
    }
    handleTextChange(event) {
        let index = event.target.getAttribute('name');
        switch (index) {
            case '2':
                this.setState({text3: event.target.value});
                break;
            case '1':
                this.setState({text2: event.target.value});
                break;
            default:
                this.setState({text1: event.target.value});
        }
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
        this.setState({fields});
    }
    categoryChanged(name) {
        if (this.NOW === name) {
            this.setState({
                fieldInputs: []
            });
        }
        let radioCategory = {
            ALL: false,
            ONE: false
        };
        radioCategory[name] = true;
        this.setState({ radioCategory });
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
    insertCompose(event) {
        if (!this.state.text1) {
            return notify('請輸入要送出的訊息', { type: 'warning' });
        } else if (Date.now() > timeHelper.toMilliseconds(this.state.time)) {
            return notify('不能選擇過去的時間', { type: 'warning' });
        }

        this.setState({ isAsyncWorking: true });

        let appId = this.state.appId;
        let userId = authHelper.userId;
        let texts = [];
        let usingRecursive = false;

        switch (this.state.count) {
            case 1:
                texts = [this.state.text1];
                break;
            case 2:
                texts = [this.state.text1, this.state.text2];
                usingRecursive = true;
                break;
            default:
                texts = [this.state.text1, this.state.text2, this.state.text3];
                usingRecursive = true;
        }

        let field_ids = {};
        let ageRange = '';
        let gender = '';
        let time = '' === this.state.time.trim() ? Date.now() : this.state.time;
        Object.values(this.state.fields).map((field) => {
            switch (field.name) {
                case 'Age':
                    ageRange = '' === this.state.fields[field.id].value ? '' : this.state.fields[field.id].value;
                    break;
                case 'Gender':
                    gender += this.state.fields[field.id].value;
                    break;
                default:
                    field_ids[field.id] = {
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
                field_ids
            };
            return compose;
        });
        return dbapi.appsComposes.insert(appId, userId, composes, usingRecursive).then(() => {
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
    renderFilter() {
        let appsFields = this.state.fields ? Object.values(this.state.fields) : [];
        if (0 >= appsFields.length) { return null; }
        return appsFields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col>
                        <Button color="secondary" hidden={this.state.fields[field.id].isSelected} name={field.id} onClick={this.handleFieldButtonChange}>
                            {'' !== field.value.trim() ? `${field.name} : ${field.value}` : field.name}
                        </Button>
                        <FormGroup hidden={!this.state.fields[field.id].isSelected}>
                            <Row>
                                <Col>
                                    <Input type="text" name={field.id} onChange={this.handleFieldInputChange}/>
                                </Col>
                                <Col>
                                    <Button color="success" name={field.id} onClick={this.handleFieldButtonChange}><i className="fas fa-check" name={field.id}></i></Button>{' '}
                                    <Button color="danger" name={field.id} onClick={this.handleFieldButtonChange}><i className="fas fa-times" name={field.id}></i></Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
            );
        });
    }
    renderMessage() {
        let count = this.state.count;
        let list = [];
        for (let c = 0; c < count; c++) {
            list.push('');
        }
        return list.map((message, index) => (
            <div key={index}>
                <span className="remove-btn" onClick={() => this.handleCountChange(this.MINUS)}>刪除</span>
                輸入文字:
                <Input type="textarea" name={index} defaultValue={list[index]} onChange={this.handleTextChange} />
            </div>
        ));
    }
    render() {
        return (
            <Modal size="lg" isOpen={this.props.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}></ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Apps: </Label>
                        <Input type="select" onChange={this.selectedApp}>
                            { this.renderApps() }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>篩選發送: </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="category" checked={this.state.radioCategory.ALL} onChange={() => this.categoryChanged(this.ALL)} />{' '}
                                全部發送
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="category" checked={this.state.radioCategory.ONE} onChange={() => this.categoryChanged(this.ONE)} />{' '}
                                限制發送對象
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    <div className="panel panel-default" hidden={!this.state.radioCategory.ONE}>
                        <div className="panel-heading">條件</div>
                        <div className="panel-body">
                            { this.renderFilter() }
                        </div>
                    </div>
                    <FormGroup>
                        <Label>設定傳送時間: </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.NOW} onChange={() => this.timeChanged(this.NOW)} />{' '}
                                立刻傳送
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.LATER} onChange={() => this.timeChanged(this.LATER)} />{' '}
                                傳送時間
                            </Label>
                            <DateTimePicker onChange={this.handleDatetimeChange} disabled={!this.state.radioTime.LATER}></DateTimePicker>
                        </FormGroup>
                    </FormGroup>
                    <div>{this.renderMessage()}</div>
                    <Table>
                        <tbody>
                            <tr>
                                <td className="add-msg-btn-padding">
                                    <p>一次可以發送三則訊息</p>
                                    <button className="add-text-btn-style" onClick={() => this.handleCountChange(this.PLUS)}>文字</button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleDraftChange} />{' '}
                            是否儲存為草稿？
                        </Label>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success" onClick={this.insertCompose} disabled={this.state.isAsyncWorking}>新增</Button>{' '}
                    <Button outline color="danger" onClick={this.props.close}>取消</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ComposeInsert.propTypes = {
    apps: PropTypes.object.isRequired,
    appsFields: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default ComposeInsert;
