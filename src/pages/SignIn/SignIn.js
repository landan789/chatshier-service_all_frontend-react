import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import browserHlp from '../../helpers/browser';
import authHlp from '../../helpers/authentication';
import apiSign from '../../helpers/apiSign/index';
import cookieHlp, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';

import './SignIn.css';

const USER_FAILED_TO_FIND = '3.1';
const PASSWORD_WAS_INCORRECT = '3.3';

class SignIn extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        browserHlp.setTitle(this.props.t('Sign in'));
        if (authHlp.hasSignedin()) {
            return window.location.replace(ROUTES.CHAT);
        }

        this.state = {
            isInputReady: false,
            isSignIning: false,
            signInBtnHtml: this.props.t('Sign in'),
            email: '',
            password: ''
        };

        this.emailChanged = this.emailChanged.bind(this);
        this.pwChanged = this.pwChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    emailChanged(ev) {
        this.setState({
            email: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.password)
        });
    }

    pwChanged(ev) {
        this.setState({
            password: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.email)
        });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isSignIning) {
            return;
        }

        let email = this.state.email;
        let pw = this.state.password;

        if (!regex.emailStrict.test(email)) {
            return notify(this.props.t('Invalid email'), { type: 'warning' });
        } else if (!pw) {
            return notify(this.props.t('Fill your password'), { type: 'warning' });
        }

        return this.signIn(email, pw);
    }

    signIn(email, password) {
        this.setState({
            isSignIning: true,
            signInBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>' + this.props.t('Signing in') + '...'
        });

        let user = {
            email: email,
            password: password
        };

        return apiSign.signIn.do(user).then((response) => {
            let jwt = response.jwt;
            let users = response.data;
            let userId = Object.keys(users).shift();
            let _user = users[userId];

            cookieHlp.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHlp.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            authHlp.jwt = jwt;
            authHlp.activateRefreshToken();

            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((err) => {
            this.setState({
                isSignIning: false,
                signInBtnHtml: this.props.t('Sign in')
            });

            switch (err.code) {
                case USER_FAILED_TO_FIND:
                    return notify(this.props.t('No user found'), { type: 'danger' });
                case PASSWORD_WAS_INCORRECT:
                    return notify(this.props.t('Wrong password!'), { type: 'danger' });
                default:
                    return notify(this.props.t('An error occurred!'), { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="signin-container w-100">
                <SignForm title={this.props.t('Sign in')} onSubmit={this.checkInputs}>
                    <div className="form-group">
                        <div className="input-group">
                            <div className="chsr input-group-prepend">
                                <span className="input-group-text w-100 justify-content-center">
                                    <i className="fas fa-envelope"></i>
                                </span>
                            </div>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                pattern={regex.emailWeak.source}
                                placeholder={this.props.t('Email')}
                                value={this.state.email}
                                onChange={this.emailChanged}
                                required />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <div className="chsr input-group-prepend">
                                <span className="input-group-text w-100 justify-content-center">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </div>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder={this.props.t('Password')}
                                value={this.state.password}
                                onChange={this.pwChanged}
                                required />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="controls">
                            <button
                                type="submit"
                                className="btn btn-info"
                                disabled={!this.state.isInputReady || this.state.isSignIning}
                                dangerouslySetInnerHTML={{__html: this.state.signInBtnHtml}}>
                            </button>
                        </div>
                    </div>
                    <div className="my-4 text-center">
                        <Route render={(router) => (
                            <p>
                                <span><Trans i18nKey="Forgot password?" /></span>
                                <span className="mx-1 link-text" onClick={() => router.history.push(ROUTES.RESET_PASSWORD)}><Trans i18nKey="Reset password" /></span>
                            </p>
                        )}></Route>
                        <Route render={(router) => (
                            <p>
                                <span><Trans i18nKey="Don't have an account yet?" /></span>
                                <span className="mx-1 link-text" onClick={() => router.history.push(ROUTES.SIGNUP)}><Trans i18nKey="Sign up" /></span>
                            </p>
                        )}></Route>
                    </div>
                </SignForm>
            </Fade>
        );
    }
}

export default withRouter(withTranslate(SignIn));
