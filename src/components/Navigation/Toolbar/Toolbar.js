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

import controlPanelStore from '../../../redux/controlPanelStore';
import { togglePanel } from '../../../redux/actions/controlPanelStore/isOpen';

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
const setNavTitle = (title) => (navTitle = title);
const BREAKPOINT_LG = 992;

class Toolbar extends React.Component {
    static propTypes = {
        onToggleChatroom: PropTypes.func,
        onToggleProfle: PropTypes.func,
        onToggleTicket: PropTypes.func,
        history: PropTypes.object.isRequired
    }

    static defaultProps = {
        onToggleChatroom: () => void 0,
        onToggleProfle: () => void 0,
        onToggleTicket: () => void 0
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.storeUnsubscribe = void 0;
        this.state = {
            isInChat: ROUTES.CHAT === this.props.history.location.pathname,
            isControlPanelOpen: false,
            isUserModalOpen: false,
            isGroupModalOpen: false,
            isIntegrationModalOpen: false,
            hasSelectChatroom: false,
            dropdownOpen: false,
            toggleButtons: {
                profile: false,
                ticket: false
            }
        };

        this.linkTo = this.linkTo.bind(this);
        this.mobileToggleControlPanel = this.mobileToggleControlPanel.bind(this);
        this.mobileToggleSetting = this.mobileToggleSetting.bind(this);
        this.closeUserModal = this.closeUserModal.bind(this);
        this.closeGroupModal = this.closeGroupModal.bind(this);
        this.closeIntegrationModal = this.closeIntegrationModal.bind(this);
        this.sizeChanged = this.sizeChanged.bind(this);
        this.toggleProfile = this.toggleProfile.bind(this);
        this.toggleTicket = this.toggleTicket.bind(this);

        window.addEventListener('resize', this.sizeChanged);
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = controlPanelStore.subscribe(() => {
            let selectedChatroom = controlPanelStore.getState().selectedChatroom;
            this.setState({ hasSelectChatroom: !!(selectedChatroom.appId && selectedChatroom.chatroomId) });
        });
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = void 0;
        window.removeEventListener('resize', this.sizeChanged);
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

    sizeChanged(ev) {
        if (this.state.toggleButtons.profile || this.state.toggleButtons.ticket) {
            if (ev.target.innerWidth < BREAKPOINT_LG) {
                this.props.onToggleChatroom(false);
            } else if (ev.target.innerWidth >= BREAKPOINT_LG) {
                this.props.onToggleChatroom(true);
            }
        }
    }

    toggleProfile() {
        let toggleButtons = this.state.toggleButtons;
        toggleButtons.profile = !toggleButtons.profile;
        toggleButtons.ticket = false;
        this.setState({ toggleButtons: toggleButtons });
        this.props.onToggleProfle(toggleButtons.profile);
        this.props.onToggleTicket(toggleButtons.ticket);
    }

    toggleTicket() {
        let toggleButtons = this.state.toggleButtons;
        toggleButtons.ticket = !toggleButtons.ticket;
        toggleButtons.profile = false;
        this.setState({ toggleButtons: toggleButtons });
        this.props.onToggleTicket(toggleButtons.ticket);
        this.props.onToggleProfle(toggleButtons.profile);
    }

    mobileToggleSetting() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    mobileToggleControlPanel() {
        controlPanelStore.dispatch(togglePanel());
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
                    window.location.assign(route);
                }
        }
    }

    render() {
        return (
            <Aux>
                <header className="chsr toolbar">
                    <nav className="navbar px-1">
                        <button type="button"
                            className="btn text-light transparent ctrl-panel-toggle d-sm-none"
                            onClick={this.mobileToggleControlPanel}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <div className="nav-title text-nowrap text-light ml-2 mr-auto">{navTitle}</div>

                        {this.state.isInChat && this.state.hasSelectChatroom &&
                        <button type="button" className={'btn mx-1 transparent' + (this.state.toggleButtons.profile ? ' active' : '')}
                            onClick={this.toggleProfile}>
                            <i className="fas fa-id-badge"></i>
                        </button>}

                        {this.state.isInChat && this.state.hasSelectChatroom &&
                        <button type="button" className={'btn mx-1 transparent' + (this.state.toggleButtons.ticket ? ' active' : '')}
                            onClick={this.toggleTicket}>
                            <i className="far fa-calendar-check"></i>
                        </button>}

                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.mobileToggleSetting}>
                            <DropdownToggle color="none" className="text-light transparent">
                                <i className="fas fa-ellipsis-v"></i>
                            </DropdownToggle>
                            <DropdownMenu className="settings-menu">
                                {setingsItems.map((item, i) => (
                                    <DropdownItem key={i} onClick={() => this.linkTo(item.link, item.useReactRouter)}>
                                        <i className={item.icon}></i>
                                        <span>{item.text}</span>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {this.state.isUserModalOpen && <User isOpen={this.state.isUserModalOpen} close={this.closeUserModal}/>}
                        {this.state.isGroupModalOpen && <Group isOpen={this.state.isGroupModalOpen} close={this.closeGroupModal}/>}
                        {this.state.isIntegrationModalOpen && <Integration isOpen={this.state.isIntegrationModalOpen} close={this.closeIntegrationModal}/>}
                    </nav>
                </header>
            </Aux>
        );
    }
}

export default withRouter(Toolbar);
export { setNavTitle };
