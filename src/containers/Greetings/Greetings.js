import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import firebase from 'firebase';

import browser from '../../helpers/browser';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import { setJWT } from '../../helpers/databaseApi/index';

import Layout from '../../components/Layout/Layout';
import { notify } from '../../components/Notify/Notify';

import './Greetings.css';

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

    }

    textChanged(ev) {
        this.setState({ text: ev.target.value });
    }

    render() {
        return (
            <div>
                <Layout>
                    <p>Hi</p>
                </Layout>
            </div>
        );
    }
}

export default Greeting;
