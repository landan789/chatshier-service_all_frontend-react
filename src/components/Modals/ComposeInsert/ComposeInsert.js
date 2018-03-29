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
        let FIELDS = [
            {
                "text" : "Name",
                "alias" : "name",
                "type" : "SYSTEM",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 0,
                "createdTime" : "2018-03-27T09:04:21.037Z",
                "updatedTime" : "2018-03-27T09:04:21.037Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea94f"
            }, 
            {
                "text" : "Assigned",
                "alias" : "assigned",
                "type" : "DEFAULT",
                "sets" : [ 
                    ""
                ],
                "setsType" : "MULTI_SELECT",
                "order" : 5,
                "createdTime" : "2018-03-27T09:04:21.049Z",
                "updatedTime" : "2018-03-27T09:04:21.049Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea959"
            }, 
            {
                "text" : "Age",
                "alias" : "age",
                "type" : "DEFAULT",
                "sets" : [ 
                    0
                ],
                "setsType" : "NUMBER",
                "order" : 1,
                "createdTime" : "2018-03-27T09:04:21.044Z",
                "updatedTime" : "2018-03-27T09:04:21.044Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea951"
            }, 
            {
                "text" : "First chat date",
                "alias" : "createdTime",
                "type" : "SYSTEM",
                "sets" : [ 
                    0
                ],
                "setsType" : "DATE",
                "order" : 6,
                "createdTime" : "2018-03-27T09:04:21.051Z",
                "updatedTime" : "2018-03-27T09:04:21.051Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea95b"
            }, 
            {
                "text" : "Gender",
                "alias" : "gender",
                "type" : "DEFAULT",
                "sets" : [ 
                    "MALE", 
                    "FEMALE"
                ],
                "setsType" : "SELECT",
                "order" : 2,
                "createdTime" : "2018-03-27T09:04:21.045Z",
                "updatedTime" : "2018-03-27T09:04:21.045Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea953"
            }, 
            {
                "text" : "Recent chat date",
                "alias" : "lastTime",
                "type" : "SYSTEM",
                "sets" : [ 
                    0
                ],
                "setsType" : "DATE",
                "order" : 7,
                "createdTime" : "2018-03-27T09:04:21.052Z",
                "updatedTime" : "2018-03-27T09:04:21.052Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea95d"
            }, 
            {
                "text" : "Email",
                "alias" : "email",
                "type" : "DEFAULT",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 3,
                "createdTime" : "2018-03-27T09:04:21.047Z",
                "updatedTime" : "2018-03-27T09:04:21.047Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea955"
            }, 
            {
                "text" : "Chat time(s)",
                "alias" : "chatCount",
                "type" : "SYSTEM",
                "sets" : [ 
                    0
                ],
                "setsType" : "NUMBER",
                "order" : 8,
                "createdTime" : "2018-03-27T09:04:21.053Z",
                "updatedTime" : "2018-03-27T09:04:21.053Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea95f"
            }, 
            {
                "text" : "Phone",
                "alias" : "phone",
                "type" : "DEFAULT",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 4,
                "createdTime" : "2018-03-27T09:04:21.048Z",
                "updatedTime" : "2018-03-27T09:04:21.048Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea957"
            }, 
            {
                "text" : "Remark",
                "alias" : "remark",
                "type" : "DEFAULT",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 9,
                "createdTime" : "2018-03-27T09:04:21.053Z",
                "updatedTime" : "2018-03-27T09:04:21.053Z",
                "isDeleted" : false,
                "_id" : "5aba091561c30448f66ea961"
            }, 
            {
                "text" : "語言",
                "alias" : "",
                "type" : "CUSTOM",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 11,
                "createdTime" : "2018-03-28T07:04:03.006Z",
                "updatedTime" : "2018-03-28T07:04:03.006Z",
                "isDeleted" : false,
                "_id" : "5abb3e63f13990476a7559e8"
            }, 
            {
                "text" : "地區",
                "alias" : "",
                "type" : "CUSTOM",
                "sets" : [ 
                    ""
                ],
                "setsType" : "TEXT",
                "order" : 10,
                "createdTime" : "2018-03-28T07:04:03.013Z",
                "updatedTime" : "2018-03-28T07:04:03.013Z",
                "isDeleted" : false,
                "_id" : "5abb3e63f13990476a7559ea"
            }
        ];
        FIELDS = FIELDS.filter((field) => false === field.isDeleted);
        FIELDS = FIELDS.filter((field) => 'Age' === field.text || 'Gender' === field.text || 'CUSTOM' === field.type);
        let fields = {};
        FIELDS.map((field) => {
            fields[field.text] = {
                id: field._id,
                name: field.text,
                isSelected: false,
                value: ''
            }
        });

        this.setState({
            appId,
            fields
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
        Object.values(this.state.fields).map((field, index) => {
            field_ids[field.id] = {
                value: field.value
            };
        });
        let age = [this.state.fields['Age'].value];
        let gender = this.state.fields['Gender'].value;
        delete field_ids[this.state.fields['Age'].id];
        delete field_ids[this.state.fields['Gender'].id];

        let composes = texts.map((text) => {
            let compose = {
                type: 'text',
                text: text,
                time: this.state.time,
                status: this.state.status,
                age,
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
        // let appsFields = Object.keys(this.props.appsFields);
        let appsFields = this.state.fields ? Object.values(this.state.fields) : [];
        if (0 >= appsFields.length) { return null; }
        return appsFields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col>
                        <Button color="secondary" hidden={this.state.fields[field.name].isSelected} name={field.name} onClick={this.handleFieldButtonChange}>
                            {'' !== field.value.trim() ? `${field.name} : ${field.value}` : field.name}
                        </Button>
                        <FormGroup hidden={!this.state.fields[field.name].isSelected}>
                            <Row>
                                <Col>
                                    <Input type="text" name={field.name} defaultValue={this.state.fields[field.name].value} onChange={this.handleFieldInputChange}/>
                                </Col>
                                <Col>
                                    <Button color="success" name={field.name} onClick={this.handleFieldButtonChange}><i className="fas fa-check" name={field.name}></i></Button>{' '}
                                    <Button color="danger" name={field.name} onClick={this.handleFieldButtonChange}><i className="fas fa-times" name={field.name}></i></Button>
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
