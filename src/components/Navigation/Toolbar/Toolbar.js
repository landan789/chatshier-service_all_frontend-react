import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';

import ROUTES from '../../../config/route';
import User from '../../Modals/User/User';
import Group from '../../Modals/Group/Group';
import Integration from '../../Modals/Integration/Integration';
import { ctrlPanelStore } from '../ControlPanel/ControlPanel';

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

let navTitle = 'Title';
const setNavTitle = (title) => {
    navTitle = title;
};

class Toolbar extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isUserModalOpen: false,
            isGroupModalOpen: false,
            isIntegrationModalOpen: false,
            isControlPanelOpen: false,
            dropdownOpen: false
        };
        this.linkTo = this.linkTo.bind(this);
        this.mobileToggleControlPanel = this.mobileToggleControlPanel.bind(this);
        this.mobileToggleSetting = this.mobileToggleSetting.bind(this);
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

    mobileToggleSetting() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    mobileToggleControlPanel() {
        ctrlPanelStore.dispatch({ type: 'TOGGLE_MENU' });
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
                <header className="chsr toolbar">
                    <nav className="navbar px-1">
                        <button type="button"
                            className="btn text-light transparent d-sm-none"
                            onClick={this.mobileToggleControlPanel}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <div className="nav-title text-nowrap text-light ml-2">
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
