import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

import ROUTES from '../../../config/route';
import NavItems from '../NavItems/NavItems';
import SideMenu from '../SideMenu/SideMenu';
import urlConfig from '../../../config/url';

import './Toolbar.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '');

const navItems = [
    {
        link: ROUTES.CHAT,
        icon: 'fas fa-comment-alt fa-fw',
        text: '聊天室'
    }, {
        link: ROUTES.CALENDAR,
        icon: 'far fa-calendar-alt fa-fw',
        text: '行事曆'
    }, {
        link: ROUTES.TICKETS,
        icon: 'fa fa-list-ul fa-fw',
        text: '待辦事項'
    }, {
        link: ROUTES.ANALYZE,
        icon: 'fa fa-chart-bar fa-fw',
        text: '訊息分析'
    }, {
        icon: 'fa fa-envelope',
        text: '訊息',
        dropdownItems: [
            {
                link: ROUTES.COMPOSES,
                icon: 'fa fa-comments',
                text: '群發'
            }, {
                link: ROUTES.AUTOREPLIES,
                icon: 'fa fa-comments',
                text: '自動回覆'
            }, {
                link: ROUTES.KEYWORDREPLIES,
                icon: 'fa fa-comments',
                text: '關鍵字回覆'
            }, {
                link: ROUTES.GREETINGS,
                icon: 'fa fa-comments',
                text: '加好友回覆'
            }
        ]
    }, {
        icon: 'fa fa-cog fa-lg',
        rightSide: true,
        dropdownItems: [
            {
                link: ROUTES.SETTINGS,
                icon: 'fa fa-user',
                text: '設定'
            }, {
                link: ROUTES.SIGNOUT,
                icon: 'fa fa-sign-out-alt',
                text: '登出'
            }
        ]
    }
];

class Toolbar extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isSideMenuOpen: false
        };
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
        this.closeSideMenu = this.closeSideMenu.bind(this);
    }

    toggleSideMenu() {
        this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen });
    }

    closeSideMenu(route, usingReactRouter) {
        if (route) {
            if (usingReactRouter) {
                this.props.history.push(route);
            } else {
                window.location.href = route;
            }
        }
        this.setState({ isSideMenuOpen: false });
    }

    render() {
        return (
            <Aux>
                <header className="toolbar">
                    <nav className="navbar normal">
                        <div className="navbar-header">
                            <a className="navbar-brand" href={wwwUrl}>Chatshier</a>
                            <NavItems items={navItems} />
                        </div>
                    </nav>
                    <nav className="navbar mobile">
                        <div className="navbar-header">
                            <button type="button"
                                className="btn btn-default btn-outline-light"
                                onClick={this.toggleSideMenu}>
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </nav>
                </header>
                <SideMenu isOpen={this.state.isSideMenuOpen} close={this.closeSideMenu}/>
            </Aux>
        );
    }
}

Toolbar.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Toolbar);
