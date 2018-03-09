import React, {Component} from 'react';

import './NavItems.css';
import NavItem from './NavItem/NavItem';

import Aux from '../../../hoc/Aux';
import DropdownMenu from './NavItem/DropdownMenu/DropdownMenu';
import DropdownItem from './NavItem/DropdownMenu/DropdownItem/DropdownItem';

class NavItems extends Component {
    constructor(props) {
        super(props);
        this.dropdownToggleHandler = this.dropdownToggleHandler.bind(this);
    }
    state = {
        message: {
            showDropdown: false,
            dropdownItems: [
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
            ]
        },

        setting: {
            showDropdown: false,
            dropdownItems: [
                {
                    link: '/setting',
                    icon: 'fa fa-user',
                    text: ' 設定'
                }, {
                    link: '/logout',
                    icon: 'fa fa-sign-out-alt',
                    text: ' 登出'
                }
            ]
        },
    }

    dropdownToggleHandler = (propName) => {
        this.state[propName].showDropdown = !this.state[propName].showDropdown;
        this.setState(this.state);
    }

    render() {
        return (
            <Aux>
                <ul className="NavItems">
                    <NavItem link="/chat"><i className="fa fa-comment fa-fw"></i>&nbsp;聊天室</NavItem>
                    <NavItem link="/calendar"><i className="fa fa-calendar fa-fw"></i>&nbsp;行事曆</NavItem>
                    <NavItem link="/ticket"><i className="fa fa-list-ul fa-fw"></i>&nbsp;待辦事項</NavItem>
                    <NavItem link="/analyze"><i className="fa fa-chart-bar fa-fw"></i>&nbsp;訊息分析</NavItem>
                    <NavItem link="#" onClick={() => this.dropdownToggleHandler('message')}><i className="fa fa-envelope"></i>&nbsp;訊息</NavItem>
                    <DropdownMenu
                        dropdownItems={this.state.message.dropdownItems}
                        open={this.state.message.showDropdown}
                        closed={() => this.dropdownToggleHandler('message')} />
                </ul>
                <ul className="NavItems right">
                    <NavItem link="#" onClick={() => this.dropdownToggleHandler('setting')}><i className="fa fa-cog fa-lg"></i></NavItem>
                    <DropdownMenu
                        dropdownItems={this.state.setting.dropdownItems}
                        open={this.state.setting.showDropdown}
                        closed={() => this.dropdownToggleHandler('setting')} />
                </ul>
            </Aux>
        );
    }
};

export default NavItems;
