import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

import NavItems from '../NavItems/NavItems';
import SideMenu from '../SideMenu/SideMenu';
import urlConfig from '../../../config/url';

import './Toolbar.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '');

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
                            <NavItems />
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
