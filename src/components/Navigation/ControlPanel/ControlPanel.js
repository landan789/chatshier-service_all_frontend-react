import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import Swiper from 'swiper/dist/js/swiper.js';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';
import ROUTES from '../../../config/route';
import controlPanelStore from '../../../redux/controlPanelStore';
import { closePanel } from '../../../redux/actions/controlPanelStore/isOpen';
import { putAwayPanel } from '../../../redux/actions/controlPanelStore/isPutAway';
import { selectChatroom } from '../../../redux/actions/controlPanelStore/selectedChatroom';
import EdgeToggle from '../EdgeToggle/EdgeToggle';

import logoPng from '../../../image/logo-no-transparent.png';
import logoSmallPng from '../../../image/logo-small.png';
import groupPng from '../../../image/group.png';
import './ControlPanel.css';

const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const WECHAT = 'WECHAT';
const CHATSHIER = 'CHATSHIER';

const LINE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg';
const FACEBOOK_LOGO = 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png';
// const WECHAT_LOGO = 'https://cdn.worldvectorlogo.com/logos/wechat.svg';

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

        this.swiper = null;

        this.state = {
            gridState: this.getGridState(window.innerWidth),
            isOpen: false,
            isPutAway: controlPanelStore.getState().isPutAway,
            itemCollapse: {}
        };

        this.storeUnsubscribe = null;
        this.linkTo = this.linkTo.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
        this.widthChanged = this.widthChanged.bind(this);
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
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks" onClick={() => this.selectChatroom(appId, chatroomId)}>
                            <img className="app-icon consumer-photo" src={groupPng} alt="無法顯示相片" />
                            <span className="app-name">群組聊天室</span>
                            <span className={'unread-msg badge badge-pill ml-auto bg-warning' + (!messager.unRead ? ' d-none' : '')}>{unReadStr}</span>
                        </ListGroupItem>
                    );
                } else {
                    let consumer = this.props.consumers[platformUid];
                    messagerItems.push(
                        <ListGroupItem key={chatroomId} className="text-light nested tablinks" onClick={() => this.selectChatroom(appId, chatroomId)}>
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
                    <img className="app-icon" src={logoPng} alt="Chatshier"/>
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
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
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
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
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

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        consumers: storeState.consumers
    };
};

export default connect(mapStateToProps)(withRouter(ControlPanel));
