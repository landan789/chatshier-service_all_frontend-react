
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import Aux from 'react-aux';

import apiDatabase from '../../../../helpers/apiDatabase/index';
import authHelper from '../../../../helpers/authentication';
import { notify } from '../../../../components/Notify/Notify';
import '../GreetingTable.css';

class MessageInsert extends Component {
    static propTypes = {
        appId: PropTypes.string.isRequired,
        message: PropTypes.object.isRequired,
        delete: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            isInserting: false,
            time: new Date(this.props.message.time).toLocaleString(),
            text: this.props.message.text || ''
        };

        this.insertMessage = this.insertMessage.bind(this);
        this.messageChanged = this.messageChanged.bind(this);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            time: new Date(props.message.time).toLocaleString(),
            text: props.message.text || ''
        });
    }

    insertMessage(ev) {
        if (!this.state.text) {
            return notify('請輸入說明內容', { type: 'warning' });
        }

        let appId = this.props.appId;
        let userId = authHelper.userId;
        let greeting = {
            type: 'text',
            text: this.state.text
        };

        this.setState({ isInserting: true });
        return apiDatabase.appsGreetings.insert(appId, userId, greeting).then(() => {
            this.setState({ isInserting: false });
            this.props.delete(ev);
        });
    }

    messageChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    render() {
        return (
            <Aux>
                <td className="Greeting__text">
                    <textarea
                        value={this.state.text}
                        onChange={this.messageChanged}>
                    </textarea>
                </td>
                <td className="Greeting__time">{this.state.time}</td>
                <td className="Greeting__button">
                    <Button disabled={this.state.isInserting}
                        color="info"
                        onClick={this.insertMessage}>
                        <span className="fas fa-check fa-fw"></span></Button>
                    <Button disabled={this.state.isInserting}
                        color="secondary"
                        onClick={this.props.delete}>
                        <span className="fas fa-times fa-fw"></span></Button>
                </td>
            </Aux>
        );
    }
}

export default MessageInsert;
