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

import './Keywordrepies.css';

class Keywordrepies extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            selectedAppId: ''
        };
        this.appChanged = this.appChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('關鍵字回覆');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;
            return userId && dbapi.appsKeywordreplies.findAll(null, userId);
        });
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
                <Fade in className="has-toolbar keywordrepies-wrapper">
                    關鍵字回覆
                    <AppsSelector showAll onChange={this.appChanged} />
                </Fade>
            </Aux>
        );
    }
}

Keywordrepies.propTypes = {
    appsKeywordrepies: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsKeywordrepies: state.appsKeywordrepies
    };
};

export default withRouter(connect(mapStateToProps)(Keywordrepies));
