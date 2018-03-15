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

import './Auto.css';

class Auto extends React.Component {
    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade className="has-toolbar">
                    Autoreplies
                </Fade>
            </Aux>
        )
    }
}

Auto.propTypes = {
};

const mapStateToProps = (state, ownProps) => {
};

export default withRouter(connect(mapStateToProps)(Auto));
