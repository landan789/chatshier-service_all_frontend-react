import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import socketHelper from '../../helpers/socket';
import apiDatabase from '../../helpers/apiDatabase/index';
import controlPanelStore from '../../redux/controlPanelStore';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';

import ChatroomPanel from './ChatroomPanel';
import ProfilePanel from './ProfilePanel';
import TicketPanel from './TicketPanel';

import './Chat.css';

class Chat extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsChatrooms: PropTypes.object,
        appsFields: PropTypes.object,
        appsTickets: PropTypes.object,
        consumers: PropTypes.object,
        groups: PropTypes.object,
        users: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.storeUnsubscribe = null;
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

        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = controlPanelStore.subscribe(() => {
            let selectedChatroom = controlPanelStore.getState().selectedChatroom;
            this.setState({
                selectedAppId: selectedChatroom.appId,
                selectedChatroomId: selectedChatroom.chatroomId
            });
        });

        let userId = authHelper.userId;
        return userId && Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsChatrooms.find(userId),
            apiDatabase.appsFields.find(userId),
            apiDatabase.appsTickets.find(null, userId),
            apiDatabase.consumers.find(userId),
            apiDatabase.groups.find(userId),
            apiDatabase.users.find(userId),
            socketHelper.connectionReady
        ]);
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = void 0;
    }

    render() {
        let shouldContainerOpen = this.state.selectedAppId && this.state.selectedChatroomId;
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper>
                    <Fade in className="chat-wrapper">
                        <div className={'d-flex position-relative w-100 h-100 chatroom-container' + (shouldContainerOpen ? ' open' : '')}>
                            <span className="position-absolute text-center watermark-text">歡迎使用 錢掌櫃 整合平台</span>
                            <ChatroomPanel
                                className="position-relative h-100 col px-0 animated slideInLeft"
                                isOpen={this.state.isOpenChatroom}
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}>
                            </ChatroomPanel>
                            <ProfilePanel className="position-relative h-100 animated slideInRight">
                            </ProfilePanel>
                            <TicketPanel className="position-relative h-100 animated slideInRight">
                            </TicketPanel>
                        </div>
                    </Fade>
                </PageWrapper>
            </Aux>
        );
    }
}

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
