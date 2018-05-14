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

const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

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

        this.toggleChatroom = this.toggleChatroom.bind(this);
        this.toggleProfle = this.toggleProfle.bind(this);
        this.toggleTicket = this.toggleTicket.bind(this);
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
            apiDatabase.appsChatrooms.find(userId),
            apiDatabase.appsFields.find(userId),
            apiDatabase.appsTickets.find(null, userId),
            apiDatabase.consumers.find(userId),
            apiDatabase.groups.find(userId),
            apiDatabase.users.find(userId)
        ]).then(() => {
            return !socketHelper.isConnected && socketHelper.connect();
        });
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = void 0;
    }

    toggleChatroom(shouleOpen) {
        if (undefined !== shouleOpen) {
            if (this.state.isOpenChatroom === !!shouleOpen) {
                return;
            }
            this.setState({ isOpenChatroom: !!shouleOpen });
            return;
        }
        this.setState({ isOpenChatroom: !this.state.isOpenChatroom });
    }

    toggleProfle(shouleOpen) {
        if (undefined !== shouleOpen) {
            if (this.state.isOpenProfile === !!shouleOpen) {
                return;
            }
            this.setState({ isOpenProfile: !!shouleOpen });
            return;
        }
        this.setState({ isOpenProfile: !this.state.isOpenProfile });
    }

    toggleTicket(shouleOpen) {
        if (undefined !== shouleOpen) {
            if (this.state.isOpenTicket === !!shouleOpen) {
                return;
            }
            this.setState({ isOpenTicket: !!shouleOpen });
            return;
        }
        this.setState({ isOpenTicket: !this.state.isOpenTicket });
    }

    render() {
        let shouldContainerOpen = this.state.selectedAppId && this.state.selectedChatroomId;
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper onToggleChatroom={this.toggleChatroom} onToggleProfle={this.toggleProfle} onToggleTicket={this.toggleTicket}>
                    <Fade in className="chat-wrapper">
                        <div className={'d-flex position-relative w-100 h-100 chatroom-container' + (shouldContainerOpen ? ' open' : '')}>
                            <span className="position-absolute text-center watermark-text">歡迎使用 錢掌櫃 整合平台</span>
                            {this.state.isOpenChatroom && <ChatroomPanel
                                className="position-relative h-100 col px-0 animated slideInLeft"
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}>
                            </ChatroomPanel>}

                            {this.state.isOpenProfile && <ProfilePanel
                                className="position-relative h-100 animated slideInRight"
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}>
                            </ProfilePanel>}

                            {this.state.isOpenTicket && <TicketPanel
                                className="position-relative h-100 animated slideInRight"
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}>
                            </TicketPanel>}
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

/**
 * @param {{[messagerId: string]: Chatshier.ChatroomMessager }} messagers
 * @return {Chatshier.ChatroomMessager}
 */
export const findMessagerSelf = (messagers) => {
    let userId = authHelper.userId;

    for (let messagerId in messagers) {
        let messager = messagers[messagerId];
        if (userId === messager.platformUid) {
            return messager;
        }
    }

    // 前端暫時用的資料，不會儲存至資料庫
    let _messagerSelf = {
        type: CHATSHIER,
        platformUid: userId,
        unRead: 0
    };
    messagers[userId] = _messagerSelf;
    return _messagerSelf;
};

/**
 * @param {{[messagerId: string]: Chatshier.ChatroomMessager }} messagers
 * @param {string} appType
 * @return {Chatshier.ChatroomMessager}
 */
export const findChatroomMessager = (messagers, appType) => {
    let userId = authHelper.userId;

    // 從 chatroom 中找尋唯一的 consumer platformUid
    for (let messagerId in messagers) {
        let messager = messagers[messagerId];

        switch (appType) {
            case LINE:
            case FACEBOOK:
            case WECHAT:
                if (appType === messager.type) {
                    return messager;
                }
                break;
            case CHATSHIER:
            default:
                if (CHATSHIER === messager.type &&
                    userId === messager.platformUid) {
                    return messager;
                }
                break;
        }
    }
    return {};
};
