import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Nav, NavItem, NavLink } from 'reactstrap';
import ROUTES from '../../config/route';

class LinkTabs extends React.Component {
    static propTypes = {
        route: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired
    }

    render() {
        let props = this.props;
        return (
            <Fade in className="m-3 tabs-container">
                <Nav tabs vertical pills>
                    <NavItem>
                        <NavLink
                            active={props.route.includes(ROUTES.SETTINGS_APPS)}
                            onClick={() => { props.toggle(ROUTES.SETTINGS_APPS); }}>
                        聊天應用程式
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={props.route.includes(ROUTES.SETTINGS_USERS)}
                            onClick={() => { props.toggle(ROUTES.SETTINGS_USERS); }}>
                        基本設定
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={props.route.includes(ROUTES.SETTINGS_FIELDS)}
                            onClick={() => { props.toggle(ROUTES.SETTINGS_FIELDS); }}>
                        客戶分類條件
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={props.route.includes(ROUTES.SETTINGS_GROUPS)}
                            onClick={() => { props.toggle(ROUTES.SETTINGS_GROUPS); }}>
                        內部群組
                        </NavLink>
                    </NavItem>
                </Nav>
            </Fade>
        );
    }
}

export default LinkTabs;
