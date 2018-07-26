import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import gCalendarHelper from '../../helpers/googleCalendar';

class SignOut extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHelper.setTitle(this.props.t('Sign out'));
        this.isSignedOut = authHelper.signOut().then(() => {
            return gCalendarHelper.signOut();
        });
    }

    componentDidMount() {
        return this.isSignedOut.then(() => this.props.history.replace(ROUTES.SIGNIN));
    }

    render() {
        return null;
    }
}

export default withRouter(withTranslate(SignOut));
