import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import LinkTabs from './LinkTabs';
import AppsTabPane from './TabPanes/AppsTabPane';
import GroupsTabPane from './TabPanes/GroupsTabPane';
import FieldsTabPane from './TabPanes/FieldsTabPane';
import UsersTabPane from './TabPanes/UsersTabPane';

import './Settings.css';

class Settings extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('設定');
        setNavTitle('設定');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    toggle(route) {
        this.props.history.replace(route);
    }

    render() {
        let route = this.props.location.pathname;

        return (
            <Aux>
                <ControlPanel />
                <div className="ml-auto w-100 page-wrapper">
                    <Toolbar />
                    <div className="setting-wrapper">
                        <LinkTabs route={route} toggle={this.toggle} />
                        <Switch>
                            <Route path={ROUTES.SETTINGS_APPS} exact component={AppsTabPane} />
                            <Route path={ROUTES.SETTINGS_USERS} exact component={UsersTabPane} />
                            <Route path={ROUTES.SETTINGS_FIELDS} exact component={FieldsTabPane} />
                            <Route path={ROUTES.SETTINGS_GROUPS} exact component={GroupsTabPane} />
                            <Redirect to={ROUTES.SETTINGS_APPS} />
                        </Switch>
                    </div>
                </div>
            </Aux>
        );
    }
}

Settings.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(Settings);
