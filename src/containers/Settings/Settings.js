import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import LinkTabs from './LinkTabs';
import AppsTabPane from './TabPanes/AppsTabPane';
import GroupsTabPane from './TabPanes/GroupsTabPane';
import FieldsTabPane from './TabPanes/FieldsTabPane';
import UsersTabPane from './TabPanes/UsersTabPane';

import './Settings.css';

class Settings extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('設定');
        setNavTitle('設定');

        if (!authHelper.hasSignedin()) {
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
                <PageWrapper>
                    <Fade in className="setting-wrapper">
                        <LinkTabs route={route} toggle={this.toggle} />
                        <Switch>
                            <Route path={ROUTES.SETTINGS_APPS} exact component={AppsTabPane} />
                            <Route path={ROUTES.SETTINGS_USERS} exact component={UsersTabPane} />
                            <Route path={ROUTES.SETTINGS_FIELDS} exact component={FieldsTabPane} />
                            <Route path={ROUTES.SETTINGS_GROUPS} exact component={GroupsTabPane} />
                            <Redirect to={ROUTES.SETTINGS_APPS} />
                        </Switch>
                    </Fade>
                </PageWrapper>
            </Aux>
        );
    }
}

export default withRouter(Settings);
