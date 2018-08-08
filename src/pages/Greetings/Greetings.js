import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Fade, Jumbotron } from 'reactstrap';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import GreetingTable from './GreetingTable/GreetingTable';

import './Greetings.css';

class Greetings extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedAppId: ''
        };

        this.appChanged = this.appChanged.bind(this);

        browserHlp.setTitle('加好友回覆');
        if (!authHlp.hasSignedin()) {
            authHlp.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    appChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle="加好友回覆">
                    <Fade in className="greetings-wrapper">
                        <div className="Greetings">
                            <Jumbotron>
                                <h1 className="display-3">加好友回覆</h1>
                                <p className="lead">一次可傳送五則訊息</p>
                                <AppsSelector onChange={this.appChanged} />
                            </Jumbotron>
                            <GreetingTable appId={this.state.selectedAppId} />
                        </div>
                    </Fade>
                </PageWrapper>
            </Aux>
        );
    }
}

export default withRouter(Greetings);
