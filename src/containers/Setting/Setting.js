import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import LinkTabs from './LinkTabs';
import AppsTabPane from './TabPanes/AppsTabPane';
import GroupsTabPane from './TabPanes/GroupsTabPane';
import TagsTabPane from './TabPanes/TagsTabPane';
import UsersTabPane from './TabPanes/UsersTabPane';

import './Setting.css';

class Setting extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('設定');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    toggle(route) {
        this.props.history.replace(route);
    }

    render() {
        let route = this.props.location.pathname;

        return (
            <Aux>
                <Toolbar />
                <div className="has-toolbar setting-wrapper">
                    <LinkTabs route={route} toggle={this.toggle} />
                    <Switch>
                        <Route path={ROUTES.SETTING_APPS} exact component={AppsTabPane} />
                        <Route path={ROUTES.SETTING_USERS} exact component={UsersTabPane} />
                        <Route path={ROUTES.SETTING_TAGS} exact component={TagsTabPane} />
                        <Route path={ROUTES.SETTING_GROUPS} exact component={GroupsTabPane} />
                        <Redirect to={ROUTES.SETTING_APPS} />
                    </Switch>
                </div>
            </Aux>
        );
    }
}

Setting.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(Setting);
