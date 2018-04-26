import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { createStore } from 'redux';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import Swiper from 'swiper/dist/js/swiper.js';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';
import ROUTES from '../../../config/route';

import './ControlPanel.css';

const TOGGLE_MENU = 'TOGGLE_MENU';
const CLOSE_MENU = 'CLOSE_MENU';
const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

const LINE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg';
const FACEBOOK_LOGO = 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png';
// const WECHAT_LOGO = 'https://cdn.worldvectorlogo.com/logos/wechat.svg';
const CHATSHIER_LOGO = '/image/logo-no-transparent.png';

const linkItems = [
    {
        link: ROUTES.CALENDAR,
        icon: 'far fa-calendar-alt fa-fw',
        text: '行事曆',
        useReactRouter: true
    }, {
        link: ROUTES.TICKETS,
        icon: 'fa fa-list-ul fa-fw',
        text: '待辦事項',
        useReactRouter: true
    }, {
        link: ROUTES.ANALYZE,
        icon: 'fa fa-chart-bar fa-fw',
        text: '訊息分析',
        useReactRouter: true
    }, {
        icon: 'fa fa-envelope fa-fw',
        text: '訊息',
        dropdownItems: [
            {
                link: ROUTES.COMPOSES,
                icon: 'fa fa-comments',
                text: '群發',
                useReactRouter: true
            }, {
                link: ROUTES.AUTOREPLIES,
                icon: 'fa fa-comments',
                text: '自動回覆',
                useReactRouter: true
            }, {
                link: ROUTES.KEYWORDREPLIES,
                icon: 'fa fa-comments',
                text: '關鍵字回覆',
                useReactRouter: true
            }, {
                link: ROUTES.GREETINGS,
                icon: 'fa fa-comments',
                text: '加好友回覆',
                useReactRouter: true
            }
        ]
    }
];

const startEvents = ['animationstart', 'oAnimationStart', 'webkitAnimationStart'];
const endEvents = ['animationend', 'oAnimationEnd', 'webkitAnimationEnd'];

const ctrlPanelOpenState = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_MENU:
            return !state;
        case CLOSE_MENU:
            return false;
        default:
            return state;
    }
};

const ctrlPanelStore = createStore(ctrlPanelOpenState);

const classes = {
    ctrlPanel: 'chsr ctrl-panel swiper-container h-100 d-none d-sm-block',
    menuToggle: 'ml-auto p-2 fas fa-times d-sm-none menu-toggle'
};

class ControlPanel extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.swiper = null;

        this.state = {
            gridState: this.getGridState(window.innerWidth),
            isOpen: false,
            itemCollapse: {}
        };

        this.storeUnsubscribe = null;
        this.linkTo = this.linkTo.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
        this.widthChanged = this.widthChanged.bind(this);
        this.startAnimating = this.startAnimating.bind(this);
        this.endAnimating = this.endAnimating.bind(this);
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = ctrlPanelStore.subscribe(() => {
            let isOpen = ctrlPanelStore.getState();
            this.setState({ isOpen: isOpen });
        });
        window.addEventListener('resize', this.widthChanged);

        let userId = authHelper.userId;
        return userId && apiDatabase.apps.find(userId);
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = void 0;
        window.removeEventListener('resize', this.widthChanged);
    }

    componentDidUpdate() {
        this.swiper && this.swiper.update();
    }

    widthChanged(ev) {
        this.setState({ gridState: this.getGridState(ev.target.innerWidth) });
    }

    linkTo(route, useReactRouter) {
        if ('sm' === this.state.gridState) {
            ctrlPanelStore.dispatch({ type: CLOSE_MENU });
        }

        if (!route) {
            return;
        }

        if (useReactRouter) {
            this.props.history.push(route);
        } else {
            window.location.assign(route);
        }
    }

    toggleItem(key) {
        let itemCollapse = this.state.itemCollapse;
        itemCollapse[key] = !itemCollapse[key];
        this.setState({ itemCollapse: itemCollapse });
    }

    startAnimating() {
        if (!this.swiper) {
            return;
        }

        /** @type {HTMLElement} */
        let elem = this.swiper.el;
        !elem.classList.contains('animating') && elem.classList.add('animating');
    };

    endAnimating() {
        if (!this.swiper) {
            return;
        }

        /** @type {HTMLElement} */
        let elem = this.swiper.el;
        elem.classList.remove('animating');
        if (elem.classList.contains('slide-in')) {
            elem.classList.remove('slide-in');
        } else if (elem.classList.contains('slide-out')) {
            elem.classList.remove('slide-out');
            elem.classList.add('d-none');
        }
    };

    /**
     * @param {HTMLElement} elem
     */
    initSwiper(elem) {
        if (this.swiper && !elem) {
            startEvents.forEach((evName) => this.swiper.el.removeEventListener(evName, this.startAnimating));
            endEvents.forEach((evName) => this.swiper.el.removeEventListener(evName, this.endAnimating));
            this.swiper.destroy(true, true);
            return;
        }

        this.swiper = new Swiper(elem, {
            loop: false,
            initialSlide: 1,
            threshold: 10, // 撥動超過 10px 才進行 slide 動作
            pagination: {
                el: '.ctrl-panel .swiper-pagination'
            }
        });

        startEvents.forEach((evName) => elem.addEventListener(evName, this.startAnimating));
        endEvents.forEach((evName) => elem.addEventListener(evName, this.endAnimating));
    }

    getGridState(width) {
        if (width <= 576) {
            return 'sm';
        } else if (width > 576 && width <= 768) {
            return 'md';
        } else if (width > 768 && width <= 992) {
            return 'lg';
        } else {
            return 'xl';
        }
    }

    renderChatroomList() {
        let isInChat = ROUTES.CHAT === this.props.history.location.pathname;
        if (!isInChat) {
            return null;
        }

        if (0 === Object.keys(this.props.apps).length ||
            0 === Object.keys(this.props.appsChatrooms).length ||
            0 === Object.keys(this.props.consumers).length) {
            // 如果資料尚未載入完成，顯示讀取圖示
            return (
                <ListGroupItem className="text-light justify-content-center">
                    <i className="fas fa-spinner fa-pulse"></i>
                </ListGroupItem>
            );
        }

        let itemCollapse = this.state.itemCollapse;
        let unreadItems = [];
        let assignedItems = [];
        let unassignedItems = [];
        let lineItems = [];
        let facebookItems = [];
        let chatshierItems = [];

        for (let appId in this.props.appsChatrooms) {
            let app = this.props.apps[appId];
            let chatrooms = this.props.appsChatrooms[appId].chatrooms;

            let messagerItems = [];
            for (let chatroomId in chatrooms) {
                let messager = this._findChatroomMessager(appId, chatroomId, app.type);
                let unReadStr = messager.unRead > 99 ? '99+' : ('' + messager.unRead);
                let platformUid = messager.platformUid;

                if (CHATSHIER === app.type) {
                    messagerItems.push(
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks">
                            <img className="app-icon consumer-photo" src="/image/group.png" alt="無法顯示相片" />
                            <span className="app-name">群組聊天室</span>
                            <span className={'unread-msg badge badge-pill ml-auto bg-warning' + (!messager.unRead ? ' d-none' : '')}>{unReadStr}</span>
                        </ListGroupItem>
                    );
                } else {
                    let consumer = this.props.consumers[platformUid];
                    messagerItems.push(
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks">
                            <img className="app-icon consumer-photo" src={consumer.photo} alt="無法顯示相片" />
                            <span className="app-name">{consumer.name}</span>
                            <span className={'unread-msg badge badge-pill ml-auto bg-warning' + (!messager.unRead ? ' d-none' : '')}>{unReadStr}</span>
                        </ListGroupItem>
                    );
                }
            }

            let appIcon = '';
            switch (app.type) {
                case LINE:
                    appIcon = 'fab fa-line';
                    break;
                case FACEBOOK:
                    appIcon = 'fab fa-facebook-messenger';
                    break;
                case CHATSHIER:
                default:
                    appIcon = 'fas fa-copyright';
                    break;
            }

            let chatroomSymbol = (
                <Aux key={appId}>
                    <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem(appId)}>
                        <i className={appIcon}></i>
                        <span>{app.name}</span>
                        <i className={'ml-auto py-1 fas ' + (itemCollapse[appId] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                    </ListGroupItem>
                    <Collapse isOpen={!itemCollapse[appId]} className="nested">{messagerItems}</Collapse>
                </Aux>
            );
            (LINE === app.type) && lineItems.push(chatroomSymbol);
            (FACEBOOK === app.type) && facebookItems.push(chatroomSymbol);
            (CHATSHIER === app.type) && chatshierItems.push(chatroomSymbol);
        }

        return (
            <Aux>
                <ListGroupItem className="text-light nested has-collapse unread" onClick={() => this.toggleItem('unreadCollapse')}>
                    <i className="fas fa-user-times"></i>
                    <span>未讀</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['unreadCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['unreadCollapse']} className="nested unread">{unreadItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse assigned" onClick={() => this.toggleItem('assignedCollapse')}>
                    <i className="fas fa-check-circle"></i>
                    <span>已指派</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['assignedCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['assignedCollapse']} className="nested assigned">{assignedItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse unassigned" onClick={() => this.toggleItem('unassignedCollapse')}>
                    <i className="fas fa-times-circle"></i>
                    <span>未指派</span>
                    <i className={'ml-auto py-1 fas ' + (!itemCollapse['unassignedCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={itemCollapse['unassignedCollapse']} className="nested unassigned">{unassignedItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('lineCollapse')}>
                    <img className="app-icon" src={LINE_LOGO} alt="LINE" />
                    <span>LINE</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['lineCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['lineCollapse']} className="nested app-types">{lineItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('facebookCollapse')}>
                    <img className="app-icon" src={FACEBOOK_LOGO} alt="Facebook" />
                    <span>FACEBOOK</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['facebookCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['facebookCollapse']} className="nested app-types">{facebookItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('chatshierCollapse')}>
                    <img className="app-icon" src={CHATSHIER_LOGO} alt="Chatshier"/>
                    <span>CHATSHIER</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['chatshierCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['chatshierCollapse']} className="nested app-types">{chatshierItems}</Collapse>
            </Aux>
        );
    }

    renderLinkItems() {
        let isInChat = ROUTES.CHAT === this.props.history.location.pathname;
        let itemCollapse = this.state.itemCollapse;

        return linkItems.map((item, i) => {
            if (item.dropdownItems) {
                return (
                    <Aux key={i} >
                        <ListGroupItem className="text-light" onClick={() => this.toggleItem(i)}>
                            <i className={item.icon}></i>
                            <span>{item.text}</span>
                            <i className={'ml-auto fas ' + (itemCollapse[i] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                        </ListGroupItem>
                        <Collapse isOpen={!itemCollapse[i]}>
                            {item.dropdownItems.map((dropdownItem, j) => (
                                <ListGroupItem className="text-light nested" key={j} onClick={() => this.linkTo(dropdownItem.link, dropdownItem.useReactRouter)}>
                                    <i className={dropdownItem.icon}></i>
                                    <span>{dropdownItem.text}</span>
                                </ListGroupItem>
                            ))}
                        </Collapse>
                    </Aux>
                );
            }

            return (
                <ListGroupItem className="text-light" key={i} onClick={() => {
                    if (ROUTES.CHAT === item.link && isInChat) {
                        return;
                    }
                    this.linkTo(item.link, item.useReactRouter);
                }}>
                    <i className={item.icon}></i>
                    <span>{item.text}</span>
                </ListGroupItem>
            );
        });
    }

    render() {
        let isInChat = ROUTES.CHAT === this.props.history.location.pathname;

        let lineApps = [];
        let fbApps = [];
        let chatshierApps = [];
        for (let appId in this.props.apps) {
            let app = this.props.apps[appId];
            switch (app.type) {
                case LINE:
                    lineApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
                            <i className="fab fa-line"></i>
                            <span>{app.name}</span>
                        </ListGroupItem>
                    );
                    break;
                case FACEBOOK:
                    fbApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
                            <i className="fab fa-facebook-messenger"></i>
                            <span>{app.name}</span>
                        </ListGroupItem>
                    );
                    break;
                case CHATSHIER:
                    chatshierApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
                            <i className="fas fa-copyright"></i>
                            <span>{app.name}</span>
                        </ListGroupItem>
                    );
                    break;
                default:
                    break;
            }
        }

        let isSmall = 'sm' === this.state.gridState;
        let isOpen = this.state.isOpen || !isSmall;
        let shouldShowBackdrop = isOpen && isSmall;
        let itemCollapse = this.state.itemCollapse;

        return (
            <Aux>
                <div className={classes.ctrlPanel + (isSmall ? ' animated' : '') + (isOpen ? ' slide-in' : ' slide-out')} ref={this.initSwiper}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <ListGroup className="detail-list">
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
                                    <span className="ctrl-panel-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>

                                <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT')}>
                                    <span>機器人</span>
                                </ListGroupItem>
                                <Collapse isOpen={!itemCollapse['CHATBOT']}>
                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + LINE)}>
                                        <img className="app-icon" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" />
                                        <span>{LINE}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + LINE] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + LINE]}>
                                        {lineApps}
                                    </Collapse>

                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + FACEBOOK)}>
                                        <img className="app-icon" src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png" alt="Facebook" />
                                        <span>{FACEBOOK}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + FACEBOOK] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + FACEBOOK]}>
                                        {fbApps}
                                    </Collapse>

                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + CHATSHIER)}>
                                        <img className="app-icon" src="/image/logo-no-transparent.png" alt="Chatshier" />
                                        <span>{CHATSHIER}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + CHATSHIER] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + CHATSHIER]}>
                                        {chatshierApps}
                                    </Collapse>
                                </Collapse>

                                <ListGroupItem className="text-light">
                                    <i className="fas fa-plus"></i>
                                    <span>新增</span>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className="swiper-slide">
                            <ListGroup className="detail-list">
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
                                    <span className="ctrl-panel-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>
                                <ListGroupItem className="text-light" onClick={() => isInChat ? this.toggleItem(ROUTES.CHAT) : this.linkTo(ROUTES.CHAT, true)}>
                                    <i className="fas fa-comment-dots fa-fw"></i>
                                    <span>聊天室</span>
                                    {isInChat && <i className={'ml-auto fas ' + (itemCollapse[ROUTES.CHAT] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>}
                                </ListGroupItem>
                                <Collapse isOpen={!itemCollapse[ROUTES.CHAT]}>
                                    {this.renderChatroomList()}
                                </Collapse>
                                {this.renderLinkItems()}
                            </ListGroup>
                        </div>
                    </div>
                    <div className="swiper-pagination w-100"></div>
                </div>
                <div className={'ctrl-panel-backdrop' + (shouldShowBackdrop ? '' : ' d-none')} onClick={() => this.linkTo()}></div>
            </Aux>
        );
    }

    _findChatroomMessager(appId, chatroomId, appType) {
        let chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
        let messagers = chatroom.messagers;
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
    }
}

ControlPanel.propTypes = {
    apps: PropTypes.object.isRequired,
    appsChatrooms: PropTypes.object.isRequired,
    consumers: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        consumers: storeState.consumers
    };
};

export default connect(mapStateToProps)(withRouter(ControlPanel));
export { ctrlPanelStore };
