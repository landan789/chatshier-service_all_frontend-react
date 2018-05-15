import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import Swiper from 'swiper/dist/js/swiper.js';

import authHelper from '../../../helpers/authentication';
import socketHelper from '../../../helpers/socket';
import apiDatabase from '../../../helpers/apiDatabase/index';
import ROUTES from '../../../config/route';

import mainStore from '../../../redux/mainStore';
import { updateChatroomsMessagers } from '../../../redux/actions/mainStore/appsChatrooms';
import controlPanelStore from '../../../redux/controlPanelStore';
import { closePanel } from '../../../redux/actions/controlPanelStore/isOpen';
import { putAwayPanel } from '../../../redux/actions/controlPanelStore/isPutAway';
import { selectChatroom } from '../../../redux/actions/controlPanelStore/selectedChatroom';
import { updateSearchKeyword } from '../../../redux/actions/controlPanelStore/searchKeyword';

import EdgeToggle from '../EdgeToggle/EdgeToggle';
import { findChatroomMessager, findMessagerSelf } from '../../../containers/Chat/Chat';

import logoPng from '../../../image/logo-no-transparent.png';
import logoSmallPng from '../../../image/logo-small.png';
import groupPng from '../../../image/group.png';
import './ControlPanel.css';

const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

const logos = {
    [LINE]: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    [FACEBOOK]: 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png',
    [WECHAT]: 'https://cdn.worldvectorlogo.com/logos/wechat.svg',
    [CHATSHIER]: logoPng
};

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

const classes = {
    ctrlPanel: 'chsr ctrl-panel swiper-container h-100 m-0 d-sm-block',
    menuToggle: 'ml-auto p-2 fas fa-times d-sm-none menu-toggle'
};

const TRANSITION_DURATION = 300;

class ControlPanel extends React.Component {
    static propTypes = {
        apps: PropTypes.object.isRequired,
        appsChatrooms: PropTypes.object.isRequired,
        consumers: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Swiper} */
        this.swiper = null;

        this.state = {
            isInChat: ROUTES.CHAT === this.props.history.location.pathname,
            gridState: this.getGridState(window.innerWidth),
            isOpen: false,
            isPutAway: controlPanelStore.getState().isPutAway,
            itemCollapse: {},
            searchKeywordPrepare: '',
            searchKeyword: ''
        };

        this.storeUnsubscribe = null;
        this.linkTo = this.linkTo.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
        this.widthChanged = this.widthChanged.bind(this);
        this.searchKeywordChanged = this.searchKeywordChanged.bind(this);
        this.searchKeywordKeyUp = this.searchKeywordKeyUp.bind(this);
        this.startAnimating = this.startAnimating.bind(this);
        this.endAnimating = this.endAnimating.bind(this);
        this.putAwayControlPanel = this.putAwayControlPanel.bind(this);
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = controlPanelStore.subscribe(() => {
            let storeState = controlPanelStore.getState();
            let isPutAway = storeState.isPutAway;
            let isOpen = storeState.isOpen;

            /** @type {HTMLElement} */
            let elem = this.swiper.el;
            isOpen && elem.classList.contains('d-none') && elem.classList.remove('d-none');

            this.setState({
                isOpen: isOpen,
                isPutAway: isPutAway
            });
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
        return new Promise((resolve) => {
            window.setTimeout(resolve, TRANSITION_DURATION + 50);
        }).then(() => {
            this.swiper && this.swiper.update();
        });
    }

    widthChanged(ev) {
        this.setState({ gridState: this.getGridState(ev.target.innerWidth) });
    }

    searchKeywordChanged(ev) {
        this.setState({ searchKeywordPrepare: ev.target.value });
        if (!ev.target.value) {
            this.setState({ searchKeyword: '' });
            controlPanelStore.dispatch(updateSearchKeyword(''));
        }
    }

    searchKeywordKeyUp(ev) {
        let keyCode = ev.keyCode || ev.which;
        switch (keyCode) {
            case 38: // 向上鍵
                return this.prevSearchMessage();
            case 40: // 向下鍵
                return this.nextSearchMessage();
            case 13: // Enter 鍵
                this.setState({ searchKeyword: this.state.searchKeywordPrepare });
                controlPanelStore.dispatch(updateSearchKeyword(this.state.searchKeywordPrepare));
                break;
            default:
                break;
        }
    }

    linkTo(route, useReactRouter) {
        if ('sm' === this.state.gridState) {
            controlPanelStore.dispatch(closePanel());
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

    putAwayControlPanel() {
        controlPanelStore.dispatch(putAwayPanel());
    }

    startAnimating() {
        if (!this.swiper) {
            return;
        }

        /** @type {HTMLElement} */
        let elem = this.swiper.el;
        !elem.classList.contains('animating') && elem.classList.add('animating');
    }

    endAnimating() {
        if (!this.swiper) {
            return;
        }

        /** @type {HTMLElement} */
        let elem = this.swiper.el;
        elem.classList.remove('animating');
        if (elem.classList.contains('slide-out')) {
            elem.classList.add('d-none');
        }
    }

    selectChatroom(appId, chatroomId) {
        controlPanelStore.dispatch(selectChatroom(appId, chatroomId));

        return socketHelper.readChatroomUnRead(appId, chatroomId).then(() => {
            let chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
            let messagerSelf = findMessagerSelf(chatroom.messagers);
            messagerSelf.unRead = 0;
            let updateMessagers = { [messagerSelf._id]: messagerSelf };
            mainStore.dispatch(updateChatroomsMessagers(appId, chatroomId, updateMessagers));
        });
    }

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

        elem.classList.add('d-none');
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
            0 === Object.keys(this.props.appsChatrooms).length) {
            // 如果資料尚未載入完成，顯示讀取圖示
            return (
                <ListGroupItem className="text-light justify-content-center">
                    <i className="fas fa-spinner fa-pulse"></i>
                </ListGroupItem>
            );
        }

        let userId = authHelper.userId;
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

            let chatroomElems = [];
            for (let chatroomId in chatrooms) {
                let chatroom = chatrooms[chatroomId];
                let isGroupChatroom = CHATSHIER === app.type || !!chatroom.platformGroupId;
                let messagerSelf = findMessagerSelf(chatroom.messagers);
                let unReadStr = messagerSelf.unRead > 99 ? '99+' : ('' + messagerSelf.unRead);
                let hasUnRead = !!messagerSelf.unRead;

                let itemElem = null;
                if (isGroupChatroom) {
                    itemElem = (
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks" onClick={() => this.selectChatroom(appId, chatroomId)}>
                            <img className="app-icon consumer-photo" src={CHATSHIER === app.type ? groupPng : logos[app.type]} alt="無法顯示相片" />
                            <span className="app-name">{chatroom.name || '群組聊天室'}</span>
                            <span className={'unread-msg badge badge-pill ml-auto bg-warning' + (!messagerSelf.unRead ? ' d-none' : '')}>{unReadStr}</span>
                        </ListGroupItem>
                    );
                } else {
                    let messager = findChatroomMessager(chatroom.messagers, app.type);
                    let platformUid = messager.platformUid;
                    let consumer = this.props.consumers[platformUid];
                    if (!consumer) {
                        continue;
                    }

                    let assignedIds = messager.assigned_ids;
                    let isAssigned = assignedIds.indexOf(userId) >= 0;

                    itemElem = (
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks" onClick={() => this.selectChatroom(appId, chatroomId)}>
                            <img className="app-icon consumer-photo" src={consumer.photo} alt="無法顯示相片" />
                            <span className="app-name">{(messagerSelf && messagerSelf.namings[platformUid]) || consumer.name}</span>
                            <span className={'unread-msg badge badge-pill ml-auto bg-warning' + (!messagerSelf.unRead ? ' d-none' : '')}>{unReadStr}</span>
                        </ListGroupItem>
                    );

                    isAssigned && assignedItems.push(itemElem);
                    !isAssigned && unassignedItems.push(itemElem);
                }
                chatroomElems.push(itemElem);
                hasUnRead && unreadItems.push(itemElem);
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

            let chatroomItem = (
                <Aux key={appId}>
                    <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem(appId)}>
                        <i className={appIcon}></i>
                        <span>{app.name}</span>
                        <i className={'ml-auto py-1 fas ' + (itemCollapse[appId] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                    </ListGroupItem>
                    <Collapse isOpen={!itemCollapse[appId]} className="nested">{chatroomElems}</Collapse>
                </Aux>
            );
            (LINE === app.type) && lineItems.push(chatroomItem);
            (FACEBOOK === app.type) && facebookItems.push(chatroomItem);
            (CHATSHIER === app.type) && chatshierItems.push(chatroomItem);
        }

        return (
            <Aux>
                <ListGroupItem className="text-light nested has-collapse unread" onClick={() => this.toggleItem('unreadCollapse')}>
                    <svg className="custom-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zm84.9 258.9c6.2 6.2 6.2 16.4 0 22.6l-11.3 11.3c-6.2 6.2-16.4 6.2-22.6 0l-51-50.9-50.9 50.9c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6l50.9-50.9-50.9-50.9c-6.2-6.2-6.2-16.4 0-22.6l11.3-11.3c6.2-6.2 16.4-6.2 22.6 0l50.9 50.9 50.9-50.9c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6L289.9 240l51 50.9z"></path>
                    </svg>
                    <span>未讀</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['unreadCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['unreadCollapse']} className="nested unread">{unreadItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse assigned" onClick={() => this.toggleItem('assignedCollapse')}>
                    <i className="fas fa-check-circle fa-fw fa-1p5x"></i>
                    <span>已指派</span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['assignedCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['assignedCollapse']} className="nested assigned">{assignedItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse unassigned" onClick={() => this.toggleItem('unassignedCollapse')}>
                    <i className="fas fa-times-circle fa-fw fa-1p5x"></i>
                    <span>未指派</span>
                    <i className={'ml-auto py-1 fas ' + (!itemCollapse['unassignedCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={itemCollapse['unassignedCollapse']} className="nested unassigned">{unassignedItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('lineCollapse')}>
                    <img className="app-icon" src={logos[LINE]} alt="LINE" />
                    <span>LINE</span>
                    <i className={'ml-auto py-1 fas ' + (!itemCollapse['lineCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={itemCollapse['lineCollapse']} className="nested app-types">{lineItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('facebookCollapse')}>
                    <img className="app-icon" src={logos[FACEBOOK]} alt="Facebook" />
                    <span>FACEBOOK</span>
                    <i className={'ml-auto py-1 fas ' + (!itemCollapse['facebookCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={itemCollapse['facebookCollapse']} className="nested app-types">{facebookItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem('chatshierCollapse')}>
                    <img className="app-icon" src={logos[CHATSHIER]} alt="Chatshier"/>
                    <span>CHATSHIER</span>
                    <i className={'ml-auto py-1 fas ' + (!itemCollapse['chatshierCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={itemCollapse['chatshierCollapse']} className="nested app-types">{chatshierItems}</Collapse>
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
        let facebookApps = [];
        let chatshierApps = [];

        for (let appId in this.props.apps) {
            let app = this.props.apps[appId];
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

            let appSymbol = (
                <ListGroupItem key={appId} className="text-light nested">
                    <i className={appIcon}></i>
                    <span>{app.name}</span>
                </ListGroupItem>
            );
            (LINE === app.type) && lineApps.push(appSymbol);
            (FACEBOOK === app.type) && facebookApps.push(appSymbol);
            (CHATSHIER === app.type) && chatshierApps.push(appSymbol);
        }

        let isSmall = 'sm' === this.state.gridState;
        let isOpen = this.state.isOpen || !isSmall;
        let isPutAway = this.state.isPutAway;
        let shouldShowBackdrop = isOpen && isSmall;
        let itemCollapse = this.state.itemCollapse;

        return (
            <Aux>
                <div className={classes.ctrlPanel + (isSmall ? ' animated' : '') + (isOpen ? ' slide-in' : ' slide-out') + (isPutAway ? ' put-away' : '')} ref={this.initSwiper}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <ListGroup className={('detail-list ' + (isPutAway ? 'd-none' : '')).trim()}>
                                <ListGroupItem className="text-light py-0 pl-2 logo-item" onClick={() => this.linkTo()}>
                                    <div className="p-1 ctrl-panel-logo">
                                        <img className="w-100 h-100" src={logoSmallPng} alt="" />
                                    </div>
                                    <span className="ctrl-panel-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>

                                <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT')}>
                                    <i className="fab fa-android"></i>
                                    <span>機器人</span>
                                </ListGroupItem>
                                <Collapse isOpen={!itemCollapse['CHATBOT']}>
                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + LINE)}>
                                        <img className="app-icon" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" />
                                        <span>{LINE}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + LINE] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + LINE]}>{lineApps}</Collapse>

                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + FACEBOOK)}>
                                        <img className="app-icon" src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png" alt="Facebook" />
                                        <span>{FACEBOOK}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + FACEBOOK] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + FACEBOOK]}>{facebookApps}</Collapse>

                                    <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT_' + CHATSHIER)}>
                                        <img className="app-icon" src={logoPng} alt="Chatshier" />
                                        <span>{CHATSHIER}</span>
                                        <i className={'ml-auto fas ' + (itemCollapse['CHATBOT_' + CHATSHIER] ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!itemCollapse['CHATBOT_' + CHATSHIER]}>{chatshierApps}</Collapse>
                                </Collapse>

                                <ListGroupItem className="text-light">
                                    <i className="fas fa-plus"></i>
                                    <span>新增</span>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className="swiper-slide">
                            <ListGroup className={('detail-list ' + (isPutAway ? 'd-none' : '')).trim()}>
                                {this.state.isInChat && <ListGroupItem className="text-light px-1 search message-search">
                                    <input className="mx-0 search-box"
                                        type="text"
                                        placeholder="搜尋文字訊息..."
                                        value={this.state.searchKeywordPrepare}
                                        onChange={this.searchKeywordChanged}
                                        onKeyUp={this.searchKeywordKeyUp} />
                                    <div className="search-results d-none">
                                        <div className="number">
                                            <span className="current-number" id="currentNumber">0</span>
                                            <span className="slash-number">/</span>
                                            <span className="total-number" id="totalNumber">0</span>
                                        </div>
                                        <i className="fas fa-chevron-up grey" aria-hidden="true"></i>
                                        <i className="fas fa-chevron-down grey" aria-hidden="true"></i>
                                    </div>
                                </ListGroupItem>}
                                <ListGroupItem className="text-light py-0 pl-2 logo-item" onClick={() => this.linkTo()}>
                                    <div className="p-1 ctrl-panel-logo">
                                        <img className="w-100 h-100" src={logoSmallPng} alt="" />
                                    </div>
                                    <span className="ctrl-panel-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>
                                <ListGroupItem className="text-light" onClick={() => isInChat ? this.toggleItem(ROUTES.CHAT) : this.linkTo(ROUTES.CHAT, true)}>
                                    <i className="fas fa-comment-dots fa-fw"></i>
                                    <span>聊天室</span>
                                    {isInChat && <i className={'ml-auto fas ' + (itemCollapse[ROUTES.CHAT] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>}
                                </ListGroupItem>
                                <Collapse isOpen={!itemCollapse[ROUTES.CHAT]}>{this.renderChatroomList()}</Collapse>
                                {this.renderLinkItems()}
                            </ListGroup>

                            <ListGroup className={('simple-list animated slideInRight ' + (isPutAway ? '' : 'd-none')).trim()}>
                                <ListGroupItem className="mb-3 px-0 text-light">
                                    <div className="p-1 mx-auto ctrl-panel-logo">
                                        <img className="w-100 h-100" src={logoSmallPng} alt="" />
                                    </div>
                                </ListGroupItem>
                                <ListGroupItem className="px-0 text-light text-center" onClick={this.putAwayControlPanel}>
                                    <i className="fas fa-comment-dots fa-2x"></i>
                                </ListGroupItem>
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={() => this.linkTo(ROUTES.CALENDAR, true)}>
                                    <i className="far fa-calendar-alt fa-2x"></i>
                                </ListGroupItem>
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={() => this.linkTo(ROUTES.TICKETS, true)}>
                                    <i className="fa fa-list-ul fa-2x"></i>
                                </ListGroupItem>
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={() => this.linkTo(ROUTES.ANALYZE, true)}>
                                    <i className="fa fa-chart-bar fa-2x"></i>
                                </ListGroupItem>
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={this.putAwayControlPanel}>
                                    <i className="fa fa-envelope fa-2x"></i>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>
                    <div className="swiper-pagination w-100"></div>
                </div>
                <EdgeToggle className={isPutAway ? 'put-away' : ''} onClick={this.putAwayControlPanel} />
                <div className={'ctrl-panel-backdrop' + (shouldShowBackdrop ? '' : ' d-none')} onClick={() => this.linkTo()}></div>
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        consumers: storeState.consumers
    };
};

export default connect(mapStateToProps)(withRouter(ControlPanel));
