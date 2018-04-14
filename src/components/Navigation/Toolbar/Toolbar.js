import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';

import ROUTES from '../../../config/route';
import { sideMenuStore } from '../SideMenu/SideMenu';

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

let navTitle = 'Title';
const setNavTitle = (title) => {
    navTitle = title;
};

class Toolbar extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isSideMenuOpen: false,
            dropdownOpen: false
        };
        this.linkTo = this.linkTo.bind(this);
        this.mobileToggleSideMenu = this.mobileToggleSideMenu.bind(this);
        this.mobileToggleSetting = this.mobileToggleSetting.bind(this);
    }

    mobileToggleSetting() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    mobileToggleSideMenu() {
        sideMenuStore.dispatch({ type: 'TOGGLE_MENU' });
    }

    linkTo(route, useReactRouter) {
        if (!route) {
            return;
        }

        if (useReactRouter) {
            this.props.history.push(route);
        } else {
            window.location.assign(route);
        }
    }

    render() {
        return (
            <Aux>
                <header className="chsr toolbar w-100">
                    <nav className="navbar px-1">
                        <button type="button"
                            className="btn text-light transparent d-sm-none"
                            onClick={this.mobileToggleSideMenu}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <div className="nav-title text-light d-flex ml-2 mr-auto">
                            {navTitle}
                        </div>

                        <button type="button" className="btn mx-1 transparent d-none">
                            <i className="far fa-file-alt"></i>
                        </button>
                        <button type="button" className="btn mx-1 transparent d-none">
                            <i className="far fa-calendar-check"></i>
                        </button>

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
