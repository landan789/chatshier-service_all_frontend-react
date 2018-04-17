import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';

import ROUTES from '../../../config/route';
import SideMenu from '../SideMenu/SideMenu';
import User from '../../Modals/User/User';
import Group from '../../Modals/Group/Group';
import Integration from '../../Modals/Integration/Integration';

import './Toolbar.css';

const setingsItems = [
    {
        link: ROUTES.SETTINGS_USERS,
        icon: 'fa fa-user',
        text: '基本設定'
    }, {
        link: ROUTES.SETTINGS_GROUPS,
        icon: 'fas fa-object-group',
        text: '內部群組'
    }, {
        link: ROUTES.SETTINGS_APPS,
        icon: 'fab fa-android',
        text: '系統整合'
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
            dropdownOpen: false,
            isUserModalOpen: false,
            isGroupModalOpen: false,
            isIntegrationModalOpen: false
        };
        this.linkTo = this.linkTo.bind(this);
        this.mobileToggleSideMenu = this.mobileToggleSideMenu.bind(this);
        this.mobileToggleSetting = this.mobileToggleSetting.bind(this);
        this.sizeChanged = this.sizeChanged.bind(this);
        this.closeUserModal = this.closeUserModal.bind(this);
        this.closeGroupModal = this.closeGroupModal.bind(this);
        this.closeIntegrationModal = this.closeIntegrationModal.bind(this);

        window.addEventListener('resize', this.sizeChanged);
    }

    closeUserModal() {
        this.setState({ isUserModalOpen: false });
    }

    closeGroupModal() {
        this.setState({ isGroupModalOpen: false });
    }

    closeIntegrationModal() {
        this.setState({ isIntegrationModalOpen: false });
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
        switch (route) {
            case ROUTES.SETTINGS_USERS:
                this.setState({ isUserModalOpen: true });
                break;
            case ROUTES.SETTINGS_GROUPS:
                this.setState({ isGroupModalOpen: true });
                break;
            case ROUTES.SETTINGS_APPS:
                this.setState({ isIntegrationModalOpen: true });
                break;
            default:
                if (useReactRouter) {
                    this.props.history.push(route);
                } else {
                    window.location.href = route;
                }
        }

        // 如果目前狀態是屬於平板的尺寸時，不關閉 sideMenu
        if ('xs' === this.gridState) {
            return;
        }
        this.setState({ isSideMenuOpen: false });
    }

    getGridState(width) {
        if (width <= 576) {
            return 'xs';
        } else if (width > 576 && width <= 768) {
            return 'sm';
        } else if (width > 768 && width <= 992) {
            return 'md';
        } else if (width > 992 && width <= 1200) {
            return 'lg';
        } else {
            return 'xl';
        }
    }

    render() {
        return (
            <Aux>
                <header className="chsr toolbar">
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
                                <i className="fas fa-ellipsis-v"></i>
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

                        <User isOpen={this.state.isUserModalOpen} close={this.closeUserModal}/>
                        <Group isOpen={this.state.isGroupModalOpen} close={this.closeGroupModal}/>
                        <Integration isOpen={this.state.isIntegrationModalOpen} close={this.closeIntegrationModal}/>
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
