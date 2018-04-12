import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Fade, Jumbotron } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import GreetingTable from './GreetingTable/GreetingTable';

import './Greetings.css';

class Greetings extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedAppId: ''
        };

        this.appChanged = this.appChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('加好友回覆');
        setNavTitle('加好友回覆');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    appChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    render() {
        return (
            <div className="ml-auto w-100">
                <Toolbar />
                <Fade className="greetings-wrapper">
                    <div className="Greetings">
                        <Jumbotron>
                            <h1 className="display-3">加好友回覆</h1>
                            <p className="lead">一次可傳送五則訊息</p>
                            <AppsSelector onChange={this.appChanged} />
                        </Jumbotron>
                        <GreetingTable appId={this.state.selectedAppId} />
                    </div>
                </Fade>
            </div>
        );
    }
}

Greetings.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Greetings);
