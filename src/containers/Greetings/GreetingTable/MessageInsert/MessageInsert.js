
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import Aux from 'react-aux';

import dbapi from '../../../../helpers/databaseApi/index';
import authHelper from '../../../../helpers/authentication';
import { notify } from '../../../../components/Notify/Notify';

const appTypes = dbapi.apps.enums.type;

class MessageInsert extends Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            time: new Date().toLocaleString(),
            text: ''
        };

        this.insertMessage = this.insertMessage.bind(this);
        this.messageChanged = this.messageChanged.bind(this);
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

        return dbapi.appsGreetings.insert(appId, userId, greeting).then((resJson) => {
            console.log(resJson.data);
        });
    }

    messageChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    render() {
        return (
            <Aux>
                <td>
                    <textarea
                        value={this.props.message.text} 
                        onChange={this.messageChanged}>
                    </textarea>
                </td>
                <td>{this.state.time}</td>
                <td>
                    <Button
                        color="info" 
                        onClick={this.insertMessage}>
                        <span className="fas fa-check fa-fw"></span></Button>
                    <Button
                        color="secondary" 
                        onClick={this.props.close}>
                        <span className="fas fa-times fa-fw"></span></Button>
                </td>
            </Aux>
        );
    }
}

MessageInsert.propTypes = {
    apps: PropTypes.object,
    isOpen: PropTypes.bool,
    close: PropTypes.func
};

export default MessageInsert;
