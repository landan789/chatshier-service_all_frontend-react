import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

import DropdownMenu from './DropdownMenu/DropdownMenu';

import './NavItems.css';

const messageDropdown = [
    {
        link: '/compose',
        icon: 'fa fa-comments',
        text: ' 群發'
    }, {
        link: '/autoreply',
        icon: 'fa fa-comments',
        text: ' 自動回覆'
    }, {
        link: '/keywordsreply',
        icon: 'fa fa-comments',
        text: ' 關鍵字回覆'
    }, {
        link: '/greeting',
        icon: 'fa fa-comments',
        text: ' 加好友回覆'
    }
];

const settingDropdown = [
    {
        link: '/setting',
        icon: 'fa fa-user',
        text: ' 設定'
    }, {
        link: '/logout',
        icon: 'fa fa-sign-out-alt',
        text: ' 登出'
    }
];

class NavItems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDropdown: {
                message: false,
                setting: false
            }
        };

        this.dropdownToggleHandler = this.dropdownToggleHandler.bind(this);
        this.linkTo = this.linkTo.bind(this);

        this.isBackdropShown = false;
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'dropdown-backdrop';
        this.backdrop.addEventListener('click', () => {
            this.dropdownToggleHandler();
        });
    }

    showBackdrop() {
        this.hideBackdrop();
        document.body.appendChild(this.backdrop);
        this.isBackdropShown = true;
    }

    hideBackdrop() {
        this.isBackdropShown && document.body.removeChild(this.backdrop);
        this.isBackdropShown = false;
    }

    dropdownToggleHandler(propName) {
        let newState = { showDropdown: {} };
        for (let _propName in this.state.showDropdown) {
            if (propName === _propName) {
                newState.showDropdown[propName] = !this.state.showDropdown[propName];
                continue;
            }
            newState.showDropdown[_propName] = false;
        }

        if (propName && newState.showDropdown[propName]) {
            this.showBackdrop();
        } else {
            this.hideBackdrop();
        }
        this.setState(newState);
    }

    linkTo(route) {
        if (route !== window.location.pathname) {
            this.hideBackdrop();
            this.props.history.push(route);
        }
    }

    render() {
        return (
            <Aux>
                <ul className="chsr nav-items">
                    <li className="chsr nav-item" onClick={() => this.linkTo('/chat')}>
                        <i className="fas fa-comment-alt fa-fw"></i>
                        <span>聊天室</span>
                    </li>
                    <li className="chsr nav-item" onClick={() => this.linkTo('/calendar')}>
                        <i className="far fa-calendar-alt fa-fw"></i>
                        <span>行事曆</span>
                    </li>
                    <li className="chsr nav-item" onClick={() => this.linkTo('/ticket')}>
                        <i className="fa fa-list-ul fa-fw"></i>
                        <span>待辦事項</span>
                    </li>
                    <li className="chsr nav-item" onClick={() => this.linkTo('/analyze')}>
                        <i className="fa fa-chart-bar fa-fw"></i>
                        <span>訊息分析</span>
                    </li>

                    <div className="dropdown-wrapper">
                        <li className="chsr nav-item" onClick={() => this.dropdownToggleHandler('message')}>
                            <i className="fa fa-envelope"></i>
                            <span>訊息</span>
                        </li>
                        <DropdownMenu
                            dropdownItems={messageDropdown}
                            open={this.state.showDropdown.message}
                            closed={this.linkTo}>
                        </DropdownMenu>
                    </div>
                </ul>

                <ul className="chsr nav-items right">
                    <div className="dropdown-wrapper">
                        <li className="chsr nav-item" onClick={() => this.dropdownToggleHandler('setting')}>
                            <i className="fa fa-cog fa-lg"></i>
                        </li>
                        <DropdownMenu
                            dropdownItems={settingDropdown}
                            open={this.state.showDropdown.setting}
                            closed={this.linkTo}>
                        </DropdownMenu>
                    </div>
                </ul>
            </Aux>
        );
    }
};

NavItems.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(NavItems);
