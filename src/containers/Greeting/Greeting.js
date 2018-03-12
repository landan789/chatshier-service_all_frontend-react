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

import './Greeting.css';

class Greeting extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            updatedTime: Date.now(),
            type: 'text',
            text: '',
            isDeleted: 0
        };

        this.textChanged = this.textChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('加好友回覆');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    textChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade className="has-toolbar">
                    Hi
                </Fade>
            </Aux>
        );
    }
}

Greeting.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(Greeting);
