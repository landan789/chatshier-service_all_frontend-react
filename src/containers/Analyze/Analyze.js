import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
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

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && dbapi.appsChatroomsMessages.find(userId);
    }

    componentWillReceiveProps(props) {

    }

    appChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar analyze-wrapper">
                    <h2>分析頁面</h2>
                    <div className="analyze-container">
                        <AppsSelector showAll onChange={this.appChanged} />
                    </div>
                </Fade>
            </Aux>
        );
    }
}

Analyze.propTypes = {
    apps: PropTypes.object,
    appsChatroomsMessages: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: state.apps,
        appsChatroomsMessages: state.appsChatroomsMessages
    };
};

export default withRouter(connect(mapStateToProps)(Analyze));
