import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

import './Chat.css';

class Chat extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    componentWillMount() {
        browserHelper.setTitle('聊天室');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            dbapi.apps.find(userId),
            dbapi.appsChatrooms.find(userId),
            dbapi.appsFields.find(userId),
            dbapi.consumers.find(userId),
            dbapi.groups.find(userId),
            dbapi.users.find(userId)
        ]);
    }

    componentWillReceiveProps(props) {

    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar chat-wrapper">
                    聊天室
                </Fade>
            </Aux>
        );
    }
}

Chat.propTypes = {
    apps: PropTypes.object,
    appsChatrooms: PropTypes.object,
    appsFields: PropTypes.object,
    consumers: PropTypes.object,
    groups: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: state.apps,
        appsChatrooms: state.appsChatrooms,
        appsFields: state.appsFields,
        consumers: state.consumers,
        groups: state.groups
    };
};

export default withRouter(connect(mapStateToProps)(Chat));
