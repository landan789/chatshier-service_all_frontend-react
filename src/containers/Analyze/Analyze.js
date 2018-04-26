import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';

import './Analyze.css';

class Analyze extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            selectedAppId: ''
        };
        this.appChanged = this.appChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('訊息分析');
        setNavTitle('訊息分析');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && apiDatabase.appsChatrooms.find(userId);
    }

    componentWillReceiveProps(props) {

    }

    appChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <div className="ml-auto w-100 page-wrapper">
                    <Toolbar />
                    <Fade in className="analyze-wrapper">
                        <h2>分析頁面</h2>
                        <div className="analyze-container">
                            <AppsSelector showAll onChange={this.appChanged} />
                        </div>
                    </Fade>
                </div>
            </Aux>
        );
    }
}

Analyze.propTypes = {
    apps: PropTypes.object,
    appsChatrooms: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms
    };
};

export default withRouter(connect(mapStateToProps)(Analyze));
