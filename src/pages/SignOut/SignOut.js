import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import browserHlp from '../../helpers/browser';
import authHlp from '../../helpers/authentication';
import gcalendarHlp from '../../helpers/googleCalendar';

class SignOut extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHlp.setTitle(props.t('Sign out'));
        this.signOutPromise = Promise.all([
            authHlp.signOut(),
            gcalendarHlp.signOut()
        ]).catch(() => void 0);
    }

    componentDidMount() {
        return this.signOutPromise.then(() => this.props.history.replace(ROUTES.SIGNIN));
    }

    render() {
        return null;
    }
}

export default withRouter(withTranslate(SignOut));
