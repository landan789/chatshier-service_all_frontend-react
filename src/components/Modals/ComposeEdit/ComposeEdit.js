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
            fields: null,
            isAsyncWorking: false
        };

        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleFieldButtonChange = this.handleFieldButtonChange.bind(this);
        this.handleFieldInputChange = this.handleFieldInputChange.bind(this);
        this.updateCompose = this.updateCompose.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let compose = nextProps.modalData ? nextProps.modalData.compose : {};
        let composeLength = Object.keys(compose).length;

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
            let value = compose.field_ids && compose.field_ids[field._id] ? compose.field_ids[field._id].value : '';
            fields[field.text] = {
                id: field._id,
                name: field.text,
                isSelected: false,
                value
            }
        });

        if (0 < composeLength) {
            this.setState({
                appId: nextProps.modalData.appId,
                composeId: nextProps.modalData.composeId,
                time: compose.time,
                ageRange: compose.ageRange || '',
                gender: compose.gender || '',
                field_ids: compose.field_ids || {},
                text: compose.text,
                status: compose.status,
                fields
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
        Object.values(this.state.fields).map((field) => {
            if ('' === field.value.trim()) {
                return;
            }
            field_ids[field.id] = {
                value: field.value
            }
        })
        let compose = {
            type: 'text',
            text: this.state.text,
            time: this.state.time,
            status: this.state.status,
            ageRange: [],
            gender: '',
            field_ids
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
