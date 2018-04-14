import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { createStore } from 'redux';

import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import Swiper from 'swiper';

import authHelper from '../../../helpers/authentication';
import apiDatabase from '../../../helpers/apiDatabase/index';
import ROUTES from '../../../config/route';

import './SideMenu.css';

const TOGGLE_MENU = 'TOGGLE_MENU';
const CLOSE_MENU = 'CLOSE_MENU';
const LINE = 'LINE';
const FACEBOOK = 'FACEBOOK';
const CHATSHIER = 'CHATSHIER';

const linkItems = [
    {
        link: ROUTES.CHAT,
        icon: 'fas fa-comment-dots fa-fw',
        text: '聊天室',
        useReactRouter: false
    }, {
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

const sideMenuOpenState = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_MENU:
            return !state;
        case CLOSE_MENU:
            return false;
        default:
            return state;
    }
};

const sideMenuStore = createStore(sideMenuOpenState);

const classes = {
    sideMenu: 'chsr side-menu swiper-container h-100',
    menuToggle: 'float-right py-1 fas fa-bars d-sm-none menu-toggle'
};

class SideMenu extends React.Component {
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
        this.storeUnsubscribe = sideMenuStore.subscribe(() => {
            let isOpen = sideMenuStore.getState();
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

    widthChanged(ev) {
        this.setState({ gridState: this.getGridState(ev.target.innerWidth) });
    }

    linkTo(route, useReactRouter) {
        if ('sm' === this.state.gridState) {
            sideMenuStore.dispatch({ type: CLOSE_MENU });
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
                el: '.side-menu .swiper-pagination'
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

    render() {
        let linkElems = linkItems.map((item, i) => {
            if (item.rightSide) {
                return null;
            }

            if (item.dropdownItems) {
                return (
                    <Aux key={i} >
                        <ListGroupItem className="text-light" onClick={() => this.toggleItem(i)}>
                            <i className={item.icon}></i>
                            <span>{item.text}</span>
                            <i className={'float-right py-1 fas ' + (this.state.itemCollapse[i] ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                        </ListGroupItem>
                        <Collapse isOpen={!this.state.itemCollapse[i]}>
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
                <ListGroupItem className="text-light" key={i} onClick={() => this.linkTo(item.link, item.useReactRouter)}>
                    <i className={item.icon}></i>
                    <span>{item.text}</span>
                </ListGroupItem>
            );
        });

        let lineApps = [];
        let fbApps = [];
        let chatshierApps = [];
        for (let appId in this.props.apps) {
            let app = this.props.apps[appId];
            switch (app.type) {
                case LINE:
                    lineApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
                            <span>{app.name}</span>
                        </ListGroupItem>
                    );
                    break;
                case FACEBOOK:
                    fbApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
                            <span>{app.name}</span>
                        </ListGroupItem>
                    );
                    break;
                case CHATSHIER:
                    chatshierApps.push(
                        <ListGroupItem key={appId} className="text-light nested">
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
        return (
            <Aux>
                <div className={classes.sideMenu + (isSmall ? ' animated' : '') + (isOpen ? ' slide-in' : ' slide-out')} ref={this.initSwiper}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <ListGroup>
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
                                    <span className="side-menu-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>

                                <ListGroupItem className="text-light" onClick={() => this.toggleItem('CHATBOT')}>
                                    <span>機器人</span>
                                </ListGroupItem>
                                <Collapse isOpen={!this.state.itemCollapse['CHATBOT']}>
                                    <ListGroupItem className="text-light nested" onClick={() => this.toggleItem(LINE)}>
                                        <i className="fab fa-line"></i>
                                        <span>{LINE}</span>
                                        <i className={'float-right py-1 fas ' + (this.state.itemCollapse[LINE] ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!this.state.itemCollapse[LINE]}>
                                        {lineApps}
                                    </Collapse>

                                    <ListGroupItem className="text-light nested" onClick={() => this.toggleItem(FACEBOOK)}>
                                        <i className="fab fa-facebook-messenger"></i>
                                        <span>{FACEBOOK}</span>
                                        <i className={'float-right py-1 fas ' + (this.state.itemCollapse[FACEBOOK] ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!this.state.itemCollapse[FACEBOOK]}>
                                        {fbApps}
                                    </Collapse>

                                    <ListGroupItem className="text-light nested" onClick={() => this.toggleItem(CHATSHIER)}>
                                        <i className="fas fa-comment-dots"></i>
                                        <span>{CHATSHIER}</span>
                                        <i className={'float-right py-1 fas ' + (this.state.itemCollapse[CHATSHIER] ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                                    </ListGroupItem>
                                    <Collapse className="nested" isOpen={!this.state.itemCollapse[CHATSHIER]}>
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
                            <ListGroup>
                                <ListGroupItem className="text-light" onClick={() => this.linkTo()}>
                                    <span className="side-menu-title">Chatshier</span>
                                    <i className={classes.menuToggle}></i>
                                </ListGroupItem>
                                {linkElems}
                            </ListGroup>
                        </div>
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
                <div className={'side-menu-backdrop' + (shouldShowBackdrop ? '' : ' d-none')} onClick={() => this.linkTo()}></div>
            </Aux>
        );
    }
}

SideMenu.propTypes = {
    apps: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps
    };
};

export default connect(mapStateToProps)(withRouter(SideMenu));
export { sideMenuStore };
