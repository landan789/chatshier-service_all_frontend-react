import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import cookieHelper from '../../helpers/cookie';

class SignOut extends React.Component {
    componentWillMount() {
        browserHelper.setTitle('登出');

        if (authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        };
        this.props.history.replace(ROUTES.SIGNIN);
    }

    render() {
        return null;
    }
}

SignOut.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(SignOut);
