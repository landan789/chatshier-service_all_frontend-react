import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import ROUTES from '../../../config/route';
import User from '../../Modals/User/User';
import Integration from '../../Modals/Integration/Integration';

import mainStore from '../../../redux/mainStore';
import controlPanelStore from '../../../redux/controlPanelStore';
import { togglePanel } from '../../../redux/actions/controlPanelStore/isOpen';

import './Toolbar.css';

const setingsItems = [
    {
        link: ROUTES.SETTINGS,
        icon: 'fa fa-user',
        text: 'Settings',
        useReactRouter: false
    }, {
        link: ROUTES.SIGNOUT,
        icon: 'fas fa-sign-out-alt',
        text: 'Sign out',
        useReactRouter: false
    }
];

const BREAKPOINT_LG = 992;

class Toolbar extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        onToggleChatroom: PropTypes.func,
        onToggleProfle: PropTypes.func,
        onToggleTicket: PropTypes.func,
        history: PropTypes.object.isRequired,
        title: PropTypes.string
    }

    static defaultProps = {
        title: '',
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
            isIntegrationModalOpen: false,
            hasSelectChatroom: false,
            isGroupChatroom: false,
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
            let newState = {
                hasSelectChatroom: !!(selectedChatroom.appId && selectedChatroom.chatroomId),
                toggleButtons: this.state.toggleButtons
            };

            if (!newState.hasSelectChatroom) {
                this.setState(newState);
                return;
            }

            let appsChatrooms = mainStore.getState().appsChatrooms;
            let chatroom = appsChatrooms[selectedChatroom.appId].chatrooms[selectedChatroom.chatroomId];
            newState.isGroupChatroom = !!chatroom.platformGroupId;
            newState.toggleButtons.ticket = false;
            newState.toggleButtons.profile = true;

            this.setState(newState);
            this.props.onToggleProfle(newState.toggleButtons.profile);
            this.props.onToggleTicket(newState.toggleButtons.ticket);
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
                            className="btn text-light transparent ctrl-panel-toggle d-md-none"
                            onClick={this.mobileToggleControlPanel}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <div className="nav-title text-nowrap text-light ml-2 mr-auto">{this.props.title}</div>

                        {this.state.isInChat && this.state.hasSelectChatroom &&
                        <button type="button" className={'btn mx-1 transparent' + (this.state.toggleButtons.profile ? ' active' : '')}
                            onClick={this.toggleProfile}>
                            <i className="fas fa-id-badge"></i>
                        </button>}

                        {this.state.isInChat && this.state.hasSelectChatroom && !this.state.isGroupChatroom &&
                        <button type="button" className={'btn mx-1 transparent' + (this.state.toggleButtons.ticket ? ' active' : '')}
                            onClick={this.toggleTicket}>
                            <i className="far fa-calendar-check"></i>
                        </button>}

                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.mobileToggleSetting}>
                            <DropdownToggle color="none" className="text-light transparent">
                                <i className="fas fa-cog fa-lg"></i>
                            </DropdownToggle>
                            <DropdownMenu className="settings-menu">
                                {setingsItems.map((item, i) => (
                                    <DropdownItem key={i} onClick={() => this.linkTo(item.link, item.useReactRouter)}>
                                        <i className={item.icon}></i>
                                        <span><Trans i18nKey={item.text} /></span>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {this.state.isUserModalOpen && <User isOpen={this.state.isUserModalOpen} close={this.closeUserModal}/>}
                        {this.state.isIntegrationModalOpen && <Integration isOpen={this.state.isIntegrationModalOpen} close={this.closeIntegrationModal}/>}
                    </nav>
                </header>
            </Aux>
        );
    }
}

export default withRouter(withTranslate(Toolbar));
