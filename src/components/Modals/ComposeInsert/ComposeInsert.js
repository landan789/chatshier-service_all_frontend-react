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
            ageButton: true,
            genderButton: true,
            ageInput: '',
            genderInput: '',
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

        this.selectedApp = this.selectedApp.bind(this);
        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertCompose = this.insertCompose.bind(this);
        this.handleAgeButtonChange = this.handleAgeButtonChange.bind(this);
        this.handleGenderButtonChange = this.handleGenderButtonChange.bind(this);
        this.handleAgeInputChange = this.handleAgeInputChange.bind(this);
        this.handleGenderInputChange = this.handleGenderInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let firstApp = Object.keys(nextProps.apps)[0];
        this.setState({appId: firstApp});
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
            case '0':
                this.setState({text1: event.target.value});
                break;
            case '1':
                this.setState({text2: event.target.value});
                break;
            default:
                this.setState({text3: event.target.value});
        }
    }
    handleAgeButtonChange(event) {
        let result = !this.state.ageButton;
        this.setState({ageInput: '', ageButton: result});
    }
    handleGenderButtonChange(event) {
        let result = !this.state.genderButton;
        this.setState({genderInput: '', genderButton: result});
    }
    handleAgeInputChange(event) {
        this.setState({ageInput: event.target.value});
    }
    handleGenderInputChange(event) {
        this.setState({genderInput: event.target.value});
    }
    categoryChanged(name) {
        if (this.NOW === name) {
            this.setState({
                ageInput: '',
                genderInput: ''
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

        let composes = texts.map((text) => {
            let compose = {
                type: 'text',
                text: text,
                time: this.state.time,
                status: this.state.status,
                ageRange: this.state.ageInput,
                gender: this.state.genderInput,
                field_ids: {} // 要加自訂欄位
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
                            <Row>
                                <Col>
                                    <Button color="secondary" onClick={this.handleAgeButtonChange} hidden={!this.state.ageButton}>年齡</Button>
                                    <FormGroup hidden={this.state.ageButton}>
                                        <Row>
                                            <Col>
                                                <Input type="text" defaultValue={this.state.ageInput} onChange={this.handleAgeInputChange} />
                                            </Col>
                                            <Col>
                                                <Button color="danger" onClick={this.handleAgeButtonChange}><i className="fas fa-times"></i></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button color="secondary" onClick={this.handleGenderButtonChange} hidden={!this.state.genderButton}>性別</Button>
                                    <FormGroup hidden={this.state.genderButton}>
                                        <Row>
                                            <Col>
                                                <Input type="text" defaultValue={this.state.genderInput} onChange={this.handleGenderInputChange} />
                                            </Col>
                                            <Col>
                                                <Button color="danger" onClick={this.handleGenderButtonChange}><i className="fas fa-times"></i></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                            </Row>
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
    appsTags: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default ComposeInsert;
