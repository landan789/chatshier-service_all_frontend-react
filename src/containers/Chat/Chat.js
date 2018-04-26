import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';

import ChatroomPanel from './ChatroomPanel';
import ProfilePanel from './ProfilePanel';
import TicketPanel from './TicketPanel';

import './Chat.css';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenChatroom: true,
            isOpenProfile: false,
            isOpenTicket: false,
            selectedAppId: '',
            selectedChatroomId: ''
        };
    }

    componentWillMount() {
        browserHelper.setTitle('聊天室');
        setNavTitle('聊天室');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsChatrooms.find(userId),
            apiDatabase.appsFields.find(userId),
            apiDatabase.appsTickets.find(null, userId),
            apiDatabase.consumers.find(userId),
            apiDatabase.groups.find(userId),
            apiDatabase.users.find(userId)
        ]);
    }

    componentWillReceiveProps(props) {

    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <div className="ml-auto w-100 page-wrapper">
                    <Toolbar />
                    <Fade in className="chat-wrapper">
                        <div className="d-flex position-relative w-100 h-100 chatroom-container">
                            <span className="position-absolute text-center watermark-text">歡迎使用 錢掌櫃 整合平台</span>
                            <ChatroomPanel
                                className="position-relative h-100 col px-0 animated slideInLeft"
                                isOpen={this.state.isOpenChatroom}
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}
                                appsChatrooms={this.props.appsChatrooms}
                                consumers={this.props.consumers}
                                users={this.props.users}>
                            </ChatroomPanel>
                            <ProfilePanel className="position-relative h-100 animated slideInRight">
                            </ProfilePanel>
                            <TicketPanel className="position-relative h-100 animated slideInRight">
                            </TicketPanel>
                        </div>
                    </Fade>
                </div>
            </Aux>
        );
    }
}

Chat.propTypes = {
    apps: PropTypes.object,
    appsChatrooms: PropTypes.object,
    appsFields: PropTypes.object,
    appsTickets: PropTypes.object,
    consumers: PropTypes.object,
    groups: PropTypes.object,
    users: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        appsFields: storeState.appsFields,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    };
};

export default withRouter(connect(mapStateToProps)(Chat));
