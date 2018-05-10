import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';

class SignOut extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

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

export default withRouter(SignOut);
