import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';

import ROUTES from '../../../config/route';
import SideMenu from '../SideMenu/SideMenu';

import './Toolbar.css';

const setingsItems = [
    {
        link: ROUTES.SETTINGS,
        icon: 'fa fa-user',
        text: '設定',
        useReactRouter: true
    }, {
        link: ROUTES.SIGNOUT,
        icon: 'fa fa-sign-out-alt',
        text: '登出',
        useReactRouter: true
    }
];

const navItems = [
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
    }, {
        icon: 'fa fa-cog fa-lg',
        rightSide: true,
        dropdownItems: setingsItems
    }
];

let navTitle = 'Title';
const setNavTitle = (title) => {
    navTitle = title;
};

class Toolbar extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            grid: this.getGridState(window.innerWidth),
            isSideMenuOpen: false,
            dropdownOpen: false
        };
        this.linkTo = this.linkTo.bind(this);
        this.mobileToggleSideMenu = this.mobileToggleSideMenu.bind(this);
        this.mobileToggleSetting = this.mobileToggleSetting.bind(this);
        this.sizeChanged = this.sizeChanged.bind(this);

        window.addEventListener('resize', this.sizeChanged);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.sizeChanged);
    }

    sizeChanged(ev) {
        this.setState({ grid: this.getGridState(ev.target.innerWidth) });
    }

    mobileToggleSetting() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    mobileToggleSideMenu() {
        this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen });
    }

    linkTo(route, useReactRouter) {
        if (route) {
            if (useReactRouter) {
                this.props.history.push(route);
            } else {
                window.location.href = route;
            }
        }

        // 如果目前狀態是屬於平板的尺寸時，不關閉 sideMenu
        if ('lg' === this.gridState) {
            return;
        }
        this.setState({ isSideMenuOpen: false });
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
        return (
            <Aux>
                <header className="chsr toolbar admin-content">
                    <nav className="navbar px-1">
                        <button type="button"
                            className="btn text-light transparent d-sm-none"
                            onClick={this.mobileToggleSideMenu}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <div className="nav-title text-light d-flex m-auto">
                            {navTitle}
                        </div>

                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.mobileToggleSetting}>
                            <DropdownToggle color="none" className="text-light transparent">
                                <i className="fa fa-cog fa-lg"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                {setingsItems.map((item, i) => (
                                    <DropdownItem key={i} onClick={() => this.linkTo(item.link, item.useReactRouter)}>
                                        <i className={item.icon}></i>
                                        <span>{item.text}</span>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <SideMenu items={navItems}
                            gridState={this.state.grid}
                            isOpen={this.state.isSideMenuOpen}
                            close={this.linkTo}/>
                    </nav>
                </header>
            </Aux>
        );
    }
}

Toolbar.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Toolbar);
export { setNavTitle };
