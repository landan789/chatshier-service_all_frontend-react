import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import { LINE, FACEBOOK, CHATSHIER } from '../../utils/appType';

class Setting extends React.Component {
    componentWillMount() {
        browserHelper.setTitle('設定');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    render() {
        return (
            <div></div>
        );
    }
}

Setting.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Setting);
