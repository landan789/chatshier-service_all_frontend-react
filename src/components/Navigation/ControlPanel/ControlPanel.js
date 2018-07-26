import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import { Collapse, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import Swiper from 'swiper/dist/js/swiper.js';

import authHelper from '../../../helpers/authentication';
import socketHelper from '../../../helpers/socket';
import apiDatabase from '../../../helpers/apiDatabase/index';
import apiBot from '../../../helpers/apiBot';
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
import defaultAvatar from '../../../image/defautlt-avatar.png';
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
        text: 'Calendar',
        useReactRouter: true
    }, {
        link: ROUTES.TICKETS,
        icon: 'fas fa-list-ul fa-fw',
        text: 'To-Do items',
        useReactRouter: true
    }, {
        link: ROUTES.ANALYSIS,
        icon: 'fas fa-chart-bar fa-fw',
        text: 'Analysis',
        useReactRouter: true
    }, {
        icon: 'fas fa-shopping-cart fa-fw',
        text: 'Product service',
        dropdownItems: [
            {
                link: ROUTES.CATEGORY_PRODUCT,
                icon: 'fas fa-cart-plus fa-fw',
                text: 'Product management',
                useReactRouter: false
            }, {
                link: ROUTES.APPOINTMENT,
                icon: 'fas fa-calendar-check fa-fw',
                text: 'Appointment system',
                useReactRouter: false
            }
        ]
    }, {
        icon: 'fas fa-envelope fa-fw',
        text: 'Messages',
        dropdownItems: [
            {
                link: ROUTES.COMPOSES,
                icon: 'fas fa-comments',
                text: 'Composes',
                useReactRouter: false
            }, {
                link: ROUTES.AUTOREPLIES,
                icon: 'fas fa-comments',
                text: 'Auto Replies',
                useReactRouter: false
            }, {
                link: ROUTES.KEYWORDREPLIES,
                icon: 'fas fa-comments',
                text: 'Keyword Replies',
                useReactRouter: false
            }, {
                link: ROUTES.GREETINGS,
                icon: 'fas fa-comments',
                text: 'Greetings',
                useReactRouter: false
            }
        ]
    }, {
        icon: 'far fa-images fa-fw',
        text: 'Graphic content',
        dropdownItems: [
            {
                link: ROUTES.RICHMENU,
                icon: 'fas fa-image',
                text: 'Rich menu',
                useReactRouter: false
            }, {
                link: ROUTES.IMAGEMAP,
                icon: 'fas fa-comment',
                text: 'Image map message',
                useReactRouter: false
            }, {
                link: ROUTES.TEMPLATE,
                icon: 'fas fa-clone',
                text: 'Template message',
                useReactRouter: false
            }
        ]
    }
];

const startEvents = ['animationstart', 'oAnimationStart', 'webkitAnimationStart'];
const endEvents = ['animationend', 'oAnimationEnd', 'webkitAnimationEnd'];

const classes = {
    ctrlPanel: 'chsr ctrl-panel swiper-container h-100 m-0 d-md-block',
    menuToggle: 'ml-auto p-2 fas fa-times d-sm-none menu-toggle'
};

const TRANSITION_DURATION = 300;

class ControlPanel extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsChatrooms: PropTypes.object.isRequired,
        consumers: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired,
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
        if ('sm' === this.state.gridState ||
            'md' === this.state.gridState) {
            controlPanelStore.dispatch(closePanel());
        }

        if (!(route && window.location.pathname !== route)) {
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

        for (let appId in this.props.apps) {
            let app = this.props.apps[appId];
            let chatroomElems = [];

            if (this.props.appsChatrooms[appId]) {
                let chatrooms = this.props.appsChatrooms[appId].chatrooms;

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
                                <img className="app-icon consumer-photo" src={CHATSHIER === app.type ? groupPng : logos[app.type]} alt="" />
                                <span className="app-name">{chatroom.name || '群組聊天室'}</span>
                                <Badge className={'unread-msg ml-auto bg-warning' + (!messagerSelf.unRead ? ' d-none' : '')} pill>{unReadStr}</Badge>
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
                                <img className="app-icon consumer-photo" src={consumer.photo || defaultAvatar} alt="" onError={() => apiBot.chatrooms.getProfile(appId, platformUid)} />
                                <span className="app-name">{(messagerSelf.namings && messagerSelf.namings[platformUid]) || consumer.name}</span>
                                <Badge className={'unread-msg ml-auto bg-warning' + (!messagerSelf.unRead ? ' d-none' : '')} pill>{unReadStr}</Badge>
                            </ListGroupItem>
                        );

                        isAssigned && assignedItems.push(itemElem);
                        !isAssigned && unassignedItems.push(itemElem);
                    }
                    chatroomElems.push(itemElem);
                    hasUnRead && unreadItems.push(itemElem);
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

            let appElemItem = (
                <Aux key={appId}>
                    <ListGroupItem className="text-light nested has-collapse" onClick={() => this.toggleItem(appId)}>
                        <i className={appIcon}></i>
                        <span>{app.name}</span>
                        <i className={'ml-auto py-1 fas ' + (itemCollapse[appId] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                    </ListGroupItem>
                    <Collapse isOpen={!itemCollapse[appId]} className="nested">{chatroomElems}</Collapse>
                </Aux>
            );
            (LINE === app.type) && lineItems.push(appElemItem);
            (FACEBOOK === app.type) && facebookItems.push(appElemItem);
            (CHATSHIER === app.type) && chatshierItems.push(appElemItem);
        }

        return (
            <Aux>
                <ListGroupItem className="text-light nested has-collapse unread" onClick={() => this.toggleItem('unreadCollapse')}>
                    <svg className="custom-item-icon large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM178.117 262.104C87.429 196.287 88.353 196.121 64 177.167V152c0-13.255 10.745-24 24-24h272c13.255 0 24 10.745 24 24v25.167c-24.371 18.969-23.434 19.124-114.117 84.938-10.5 7.655-31.392 26.12-45.883 25.894-14.503.218-35.367-18.227-45.883-25.895zM384 217.775V360c0 13.255-10.745 24-24 24H88c-13.255 0-24-10.745-24-24V217.775c13.958 10.794 33.329 25.236 95.303 70.214 14.162 10.341 37.975 32.145 64.694 32.01 26.887.134 51.037-22.041 64.72-32.025 61.958-44.965 81.325-59.406 95.283-70.199z"></path>
                    </svg>
                    <span><Trans i18nKey="Unread" /></span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['unreadCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['unreadCollapse']} className="nested unread">{unreadItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse assigned" onClick={() => this.toggleItem('assignedCollapse')}>
                    <svg className="custom-item-icon large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M400 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zm-204.686-98.059l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L184 302.745l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.25 16.379 6.25 22.628.001z"></path>
                    </svg>
                    <span><Trans i18nKey="Assigned" /></span>
                    <i className={'ml-auto py-1 fas ' + (itemCollapse['assignedCollapse'] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                </ListGroupItem>
                <Collapse isOpen={!itemCollapse['assignedCollapse']} className="nested assigned">{assignedItems}</Collapse>
                <ListGroupItem className="text-light nested has-collapse unassigned" onClick={() => this.toggleItem('unassignedCollapse')}>
                    <svg className="custom-item-icon large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-54.4 289.1c4.7 4.7 4.7 12.3 0 17L306 377.6c-4.7 4.7-12.3 4.7-17 0L224 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L102.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L280 256l65.6 65.1z"></path>
                    </svg>
                    <span><Trans i18nKey="Unassigned" /></span>
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
                            <span><Trans i18nKey={item.text} /></span>
                            <i className={'ml-auto fas ' + (itemCollapse[i] ? 'fa-chevron-down' : 'fa-chevron-up') + ' collapse-icon'}></i>
                        </ListGroupItem>
                        <Collapse isOpen={!itemCollapse[i]}>
                            {item.dropdownItems.map((dropdownItem, j) => (
                                <ListGroupItem className="text-light nested" key={j} onClick={() => this.linkTo(dropdownItem.link, dropdownItem.useReactRouter)}>
                                    <i className={dropdownItem.icon}></i>
                                    <span><Trans i18nKey={dropdownItem.text}>{dropdownItem.text}</Trans></span>
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
                    <span><Trans i18nKey={item.text}>{item.text}</Trans></span>
                </ListGroupItem>
            );
        });
    }

    render() {
        let isInChat = ROUTES.CHAT === this.props.history.location.pathname;
        let isSmall = 'sm' === this.state.gridState || 'md' === this.state.gridState;
        let isOpen = this.state.isOpen || !isSmall;
        let isPutAway = this.state.isPutAway;
        let shouldShowBackdrop = isOpen && isSmall;

        return (
            <Aux>
                <div className={classes.ctrlPanel + (isSmall ? ' animated' : '') + (isOpen ? ' slide-in' : ' slide-out') + (isPutAway ? ' put-away' : '')} ref={this.initSwiper}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            {!isPutAway &&
                            <ListGroup className="detail-list">
                                {this.state.isInChat &&
                                <ListGroupItem className="text-light px-1 search message-search">
                                    <input className="mx-0 search-box"
                                        type="text"
                                        placeholder={this.props.t('Search messages of text...')}
                                        value={this.state.searchKeywordPrepare}
                                        onChange={this.searchKeywordChanged}
                                        onKeyUp={this.searchKeywordKeyUp} />
                                    <div className="search-results d-none">
                                        <div className="number">
                                            <span className="current-number">0</span>
                                            <span className="slash-number">/</span>
                                            <span className="total-number">0</span>
                                        </div>
                                        <i className="fas fa-chevron-up grey"></i>
                                        <i className="fas fa-chevron-down grey"></i>
                                    </div>
                                </ListGroupItem>}

                                <ListGroupItem className="text-light py-0 pl-2 logo-item" onClick={() => this.linkTo()}>
                                    <div className="p-1 ctrl-panel-logo">
                                        <img className="w-100 h-100" src={logoSmallPng} alt="" />
                                    </div>
                                    <span className="ctrl-panel-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>

                                <ListGroupItem className="text-light" onClick={() => !isInChat && this.linkTo(ROUTES.CHAT, false)}>
                                    <i className="fas fa-comment-dots fa-fw"></i>
                                    <span><Trans i18nKey="Chatroom" /></span>
                                </ListGroupItem>
                                <Collapse isOpen>{this.renderChatroomList()}</Collapse>
                                {this.renderLinkItems()}
                            </ListGroup>}

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
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={() => this.linkTo(ROUTES.ANALYSIS, true)}>
                                    <i className="fa fa-chart-bar fa-2x"></i>
                                </ListGroupItem>
                                <ListGroupItem className="mt-3 px-0 text-light text-center" onClick={this.putAwayControlPanel}>
                                    <i className="fa fa-envelope fa-2x"></i>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>
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
        consumers: storeState.consumers,
        groups: storeState.groups
    };
};

export default connect(mapStateToProps)(withRouter(withTranslate(ControlPanel)));
