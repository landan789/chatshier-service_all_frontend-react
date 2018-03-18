import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Nav, NavItem, NavLink } from 'reactstrap';
import ROUTES from '../../config/route';

const LinkTabs = (props) => (
    <Fade in className="m-3 tabs-container">
        <Nav tabs vertical pills>
            <NavItem>
                <NavLink
                    active={props.route.includes(ROUTES.SETTING_APPS)}
                    onClick={() => { props.toggle(ROUTES.SETTING_APPS); }}>
                聊天應用程式
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    active={props.route.includes(ROUTES.SETTING_USERS)}
                    onClick={() => { props.toggle(ROUTES.SETTING_USERS); }}>
                基本設定
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    active={props.route.includes(ROUTES.SETTING_TAGS)}
                    onClick={() => { props.toggle(ROUTES.SETTING_TAGS); }}>
                客戶分類條件
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    active={props.route.includes(ROUTES.SETTING_GROUPS)}
                    onClick={() => { props.toggle(ROUTES.SETTING_GROUPS); }}>
                內部群組
                </NavLink>
            </NavItem>
        </Nav>
    </Fade>
);

LinkTabs.propTypes = {
    route: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired
};

export default LinkTabs;
