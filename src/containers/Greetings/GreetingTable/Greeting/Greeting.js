import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import authHelper from '../../../../helpers/authentication';
import apiDatabase from '../../../../helpers/apiDatabase/index';
import { notify } from '../../../../components/Notify/Notify';
import './Greeting.css';

class Greeting extends Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isDeleteing: false
        };
    }

    deleteGreeting(ev) {
        let appId = this.props.appId;
        let userId = authHelper.userId;
        let greetingId = this.props.greetingId;

        this.setState({ isDeleteing: true });
        return apiDatabase.appsGreetings.delete(appId, userId, greetingId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    render() {
        return (
            <Aux>
                <tr className="Greeting">
                    <td className="Greeting__text">{this.props.text}</td>
                    <td className="Greeting__time">{new Date(this.props.time).toLocaleString()}</td>
                    <td className="Greeting__button">
                        <Button disabled={this.state.isDeleteing}
                            color="danger"
                            onClick={this.deleteGreeting.bind(this)}>
                            <span className="fas fa-trash-alt fa-fw"></span>
                        </Button>
                    </td>
                </tr>
            </Aux>
        );
    }
}

Greeting.propTypes = {
    appId: PropTypes.string.isRequired,
    greetingId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsGreetings: state.appsGreetings
    };
};

export default connect(mapStateToProps)(Greeting);
