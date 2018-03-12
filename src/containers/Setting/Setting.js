import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

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
            <Aux>
                <Toolbar />
                <Fade className="has-toolbar">
                    Setting
                </Fade>
            </Aux>
        );
    }
}

Setting.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Setting);
