import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import socketHlp from '../../helpers/socket';
import apiDatabase from '../../helpers/apiDatabase/index';
import controlPanelStore from '../../redux/controlPanelStore';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
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
        t: PropTypes.func.isRequired,
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

        browserHlp.setTitle(props.t('Chatroom'));
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.storeUnsubscribe = null;
        this.state = {
            isOpenChatroom: true,
            isOpenProfile: false,
            isOpenTicket: false,
            chatroomTitle: props.t('Chatroom'),
            selectedAppId: '',
            selectedChatroomId: '',
            searchKeyword: ''
        };

        this.onSelectChatroomChanged = this.onSelectChatroomChanged.bind(this);
        this.toggleChatroom = this.toggleChatroom.bind(this);
        this.toggleProfle = this.toggleProfle.bind(this);
        this.toggleTicket = this.toggleTicket.bind(this);
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = controlPanelStore.subscribe(this.onSelectChatroomChanged);

        return Promise.all([
            apiDatabase.appsChatrooms.find(),
            apiDatabase.appsFields.find(),
            apiDatabase.appsTickets.find(),
            apiDatabase.consumers.find(),
            apiDatabase.groups.find(),
            apiDatabase.users.find()
        ]).then(() => {
            return !socketHlp.isConnected && socketHlp.connect();
        });
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = void 0;
    }

    onSelectChatroomChanged() {
        let storeState = controlPanelStore.getState();
        let searchKeyword = storeState.searchKeyword;
        let selectedChatroom = storeState.selectedChatroom;

        let hasSelectChatroom = !!(selectedChatroom.appId && selectedChatroom.chatroomId);
        let newState = {
            chatroomTitle: this.props.t('Chatroom'),
            searchKeyword: searchKeyword,
            selectedAppId: selectedChatroom.appId,
            selectedChatroomId: selectedChatroom.chatroomId
        };

        if (hasSelectChatroom) {
            let apps = this.props.apps;
            let appsChatrooms = this.props.appsChatrooms;
            let app = apps[selectedChatroom.appId];
            let chatroom = appsChatrooms[selectedChatroom.appId].chatrooms[selectedChatroom.chatroomId];
            let messagers = chatroom.messagers;
            let messagerSelf = findMessagerSelf(messagers);

            let messagerNameList = [];
            for (let messagerId in messagers) {
                let messager = messagers[messagerId];
                if (app.type === messager.type) {
                    if (app.type !== CHATSHIER) {
                        let displayName = (messagerSelf.namings && messagerSelf.namings[messager.platformUid]) || this.props.consumers[messager.platformUid].name;
                        messagerNameList.push(displayName);
                    } else if (app.type === CHATSHIER) {
                        messagerNameList.push(this.props.users[messager.platformUid].name);
                    }
                }
            }
            newState.chatroomTitle += ' #' + app.name + ' (' + messagerNameList.join(',') + ')';
        }

        this.setState(newState);
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
                <PageWrapper toolbarTitle={this.state.chatroomTitle} onToggleChatroom={this.toggleChatroom} onToggleProfle={this.toggleProfle} onToggleTicket={this.toggleTicket}>
                    <Fade in className="chat-wrapper">
                        <div className={'d-flex position-relative w-100 h-100 chatroom-container' + (shouldContainerOpen ? ' open' : '')}>
                            <span className="position-absolute text-center watermark-text">
                                <Trans i18nKey="Welcome to Chatshier integration platform" />
                            </span>

                            {this.state.isOpenChatroom && <ChatroomPanel
                                className="position-relative h-100 col px-0 animated slideInLeft"
                                appId={this.state.selectedAppId}
                                chatroomId={this.state.selectedChatroomId}
                                searchKeyword={this.state.searchKeyword}>
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
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        appsFields: storeState.appsFields,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Chat)));

/**
 * @param {{[messagerId: string]: Chatshier.ChatroomMessager }} messagers
 * @return {Chatshier.Model.ChatroomMessager}
 */
export const findMessagerSelf = (messagers) => {
    let userId = authHlp.userId;

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
 * @return {Chatshier.Model.ChatroomMessager}
 */
export const findChatroomMessager = (messagers, appType) => {
    let userId = authHlp.userId;

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
