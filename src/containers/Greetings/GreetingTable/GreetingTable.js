import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import Aux from 'react-aux';
import { connect } from 'react-redux';
import authHelper from '../../../helpers/authentication';
import dbapi from '../../../helpers/databaseApi/index';
import classes from './GreetingTable.css';

import Greeting from './Greeting/Greeting';
import MessageInsert from './MessageInsert/MessageInsert';

class GreetingTable extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            messageList: []
        };

        this.openInsertMessage = this.openInsertMessage.bind(this);
        this.closeInsertMessage = this.closeInsertMessage.bind(this);
    }

    componentDidMount() {
        authHelper.ready.then(() => {
            let userId = authHelper.userId;
            return dbapi.appsGreetings.findAll('', userId).then((resJson) => {
                console.log(resJson);
            });
        });
    }

    openInsertMessage(ev) {
        this.state.messageList.push(1);
        this.setState({ messageList: this.state.messageList });
    }

    closeInsertMessage(ev) {
        this.state.messageList.pop(1);
        this.setState({ messageList: this.state.messageList });
    }

    render() {
        let appId = this.props.appId;
        let greetingsList = [];
        if (appId) {
            let greetings = this.props.appsGreetings[appId].greetings;
            let greetingIds = Object.keys(greetings);
            greetingsList = greetingIds.map((greetingId) => {
                let greeting = greetings[greetingId];
                return <Greeting
                    key={greetingId}
                    appId={appId}
                    greetingId={greetingId}
                    text={greeting.text}
                    time={greeting.updatedTime}/>;
            });
        }

        return (
            <Aux>
                {this.props.appId ? <Table className="Table">
                    <thead>
                        <tr>
                            <th>文字</th>
                            <th>新增時間</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {greetingsList}
                        {this.state.messageList.map((message, i) => (
                            <tr className="Greeting" key={i}>
                                <MessageInsert
                                    appId={this.props.appId}
                                    message={message}
                                    close={this.closeInsertMessage}>
                                </MessageInsert>
                            </tr>
                        ))}
                        <tr className="buttons">
                            <th></th>
                            <td></td>
                            <td>
                                <Button
                                    color="primary"
                                    onClick={this.openInsertMessage}>
                                    <span className="fas fa-plus fa-fw"></span>
                                    新增
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table> : null}
            </Aux>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsGreetings: state.appsGreetings
    };
};

export default connect(mapStateToProps)(GreetingTable);
