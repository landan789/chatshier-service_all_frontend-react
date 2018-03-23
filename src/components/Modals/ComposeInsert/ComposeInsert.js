import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col, Table } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';

class ComposeInsert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            time: '',
            status: 0,
            radioCategory: {
                all: true,
                one: false
            },
            radioTime: {
                now: true,
                later: false
            },
            count: 0,
            messages: null,
            isAsyncWorking: false
        };

        this.plus = 'PLUS';
        this.minus = 'MINUS';

        this.selectedApp = this.selectedApp.bind(this);
        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertCompose = this.insertCompose.bind(this);
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
        this.setState({ status: event.target.checked });
    }
    handleCountChange(operator) {
        let count = this.plus === operator ? this.state.count + 1 : this.state.count - 1;
        let messages = [];
        for (let c = 0; c < count; c++) {
            messages.push({text: ''});
        }
        if (3 >= count) {
            this.setState({ count, messages });
        }
    }
    insertCompose() {
        console.log(this.state.status);
        console.log(this.state.messages);
    }
    handleTextChange(event) {
        let index = event.target.getAttribute('name');
        let messages = this.state.messages[index];
        console.log(this.state.messages);
        // messages.text = event.target.value;
        // this.setState({ messages });
    }
    categoryChanged(name) {
        let radioCategory = {
            all: false,
            one: false
        };
        radioCategory[name] = true;
        this.setState({ radioCategory });
    }
    timeChanged(name) {
        let radioTime = {
            now: false,
            later: false
        };
        radioTime[name] = true;
        this.setState({ radioTime });
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
    renderMessage() {
        let count = this.state.count;
        let list = [];
        for (let c = 0; c < count; c++) {
            list.push({text: ''});
        }
        return list.map((message, index) => (
            <div key={index}>
                <span className="remove-btn" onClick={() => this.handleCountChange(this.minus)}>刪除</span>
                輸入文字:
                <Input type="textarea" name={index} onChange={this.handleTextChange} />
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
                                <Input type="radio" name="category" checked={this.state.radioCategory.all} onChange={() => this.categoryChanged('all')} />{' '}
                                全部發送
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="category" checked={this.state.radioCategory.one} onChange={() => this.categoryChanged('one')} />{' '}
                                限制發送對象
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    <div className="panel panel-default" hidden={!this.state.radioCategory.one}>
                        <div className="panel-heading">條件</div>
                        <div className="panel-body">
                            <Row>
                                <Col>
                                    <Button color="secondary">年齡</Button>
                                </Col>
                                <Col>
                                    <Button color="secondary">性別</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <FormGroup>
                        <Label>設定傳送時間: </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.now} onChange={() => this.timeChanged('now')} />{' '}
                                立刻傳送
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="time" checked={this.state.radioTime.later} onChange={() => this.timeChanged('later')} />{' '}
                                傳送時間
                            </Label>
                            <DateTimePicker onChange={this.handleDatetimeChange} disabled={!this.state.radioTime.later}></DateTimePicker>
                        </FormGroup>
                    </FormGroup>
                    <div>{this.renderMessage()}</div>
                    <Table>
                        <tbody>
                            <tr>
                                <td className="add-msg-btn-padding">
                                    <p>一次可以發送三則訊息</p>
                                    <button className="add-text-btn-style" onClick={() => this.handleCountChange(this.plus)}>文字</button>
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
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired
};

export default ComposeInsert;
