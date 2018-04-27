import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';

import Greeting from './Greeting/Greeting';
import MessageInsert from './MessageInsert/MessageInsert';

import './GreetingTable.css';

class GreetingTable extends React.Component {
    static propTypes = {
        appId: PropTypes.string,
        appsGreetings: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            insertList: []
        };

        this.addInsertMessage = this.addInsertMessage.bind(this);
        this.deleteInsertMessage = this.deleteInsertMessage.bind(this);
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return apiDatabase.appsGreetings.find(null, userId);
    }

    addInsertMessage(ev) {
        this.state.insertList.push({
            text: '',
            time: Date.now()
        });
        this.setState({ insertList: this.state.insertList });
    }

    deleteInsertMessage(ev, i) {
        this.state.insertList.splice(i, 1);
        this.setState({ insertList: this.state.insertList });
    }

    render() {
        let appId = this.props.appId;
        let greetings, greetingIds, greetingsList;

        if (appId && this.props.appsGreetings[appId]) {
            greetings = this.props.appsGreetings[appId].greetings;
            greetingIds = Object.keys(greetings);
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
                <Table className="Table">
                    <thead>
                        <tr>
                            <th className="Greeting__text">文字</th>
                            <th className="Greeting__time">新增時間</th>
                            <th className="Greeting__button">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {greetingsList}
                        {this.state.insertList.map((message, i) => (
                            <tr className="Greeting" key={i}>
                                <MessageInsert
                                    appId={this.props.appId}
                                    message={message}
                                    delete={(ev) => this.deleteInsertMessage(ev, i)}>
                                </MessageInsert>
                            </tr>
                        ))}
                        <tr>
                            <td className="Greeting__text"></td>
                            <td className="Greeting__time"></td>
                            <td className="Greeting__button">
                                <Button
                                    color="primary"
                                    onClick={this.addInsertMessage}>
                                    <span className="fas fa-plus fa-fw"></span>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsGreetings: storeState.appsGreetings
    };
};

export default connect(mapStateToProps)(GreetingTable);
