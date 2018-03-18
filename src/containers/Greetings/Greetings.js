import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter, Link } from 'react-router-dom';
import { Fade, Jumbotron, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import GreetingTable from './GreetingTable/GreetingTable';

import './Greetings.css';

class Greetings extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            updatedTime: Date.now(),
            type: 'text',
            text: '',
            isDeleted: 0
        };

        this.textChanged = this.textChanged.bind(this);
        this.botChanged = this.botChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('加好友回覆');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    textChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    botChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade className="has-toolbar">
                    <div className="Greetings">
                        <Jumbotron>
                            <h1 className="display-3">加好友回覆</h1>
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                                <BreadcrumbItem><Link to="#">Message</Link></BreadcrumbItem>
                                <BreadcrumbItem active>Greeting</BreadcrumbItem>
                            </Breadcrumb>
                            <p className="lead">一次可傳送五則訊息</p>
                            <AppsSelector onChange={this.botChanged} />
                        </Jumbotron>
                        <GreetingTable appId={this.state.selectedAppId} />
                    </div>
                </Fade>
            </Aux>
        );
    }
}

Greetings.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Greetings);
