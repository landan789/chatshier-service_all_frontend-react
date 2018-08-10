import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import CHATSHIER_CFG from '../../config/chatshier';
import browserHlp from '../../helpers/browser';
import authHlp from '../../helpers/authentication';
import cookieHlp, { CHSR_COOKIE } from '../../helpers/cookie';
import apiSign from '../../helpers/apiSign/index';
import regex from '../../utils/regex';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';

import './SignUp.css';

const NAME_WAS_EMPTY = 'name was empty';
const EMAIL_WAS_EMPTY = 'EMAIL was empty';
const PASSWORD_WAS_EMPTY = 'password was empty';
const USER_EMAIL_HAD_BEEN_SIGNED_UP = 'user email had been signed up';

class SignUp extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        browserHlp.setTitle(this.props.t('Sign up'));
        if (authHlp.hasSignedin()) {
            return window.location.replace(ROUTES.CHAT);
        }

        this.state = {
            isInputReady: false,
            isSignUping: false,
            signupBtnHtml: this.props.t('Sign up'),
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
        };

        this.nameChanged = this.nameChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.pwChanged = this.pwChanged.bind(this);
        this.pwConfirmChanged = this.pwConfirmChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    nameChanged(ev) {
        this.setState({
            name: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.email && this.state.password && this.state.passwordConfirm)
        });
    }

    emailChanged(ev) {
        this.setState({
            email: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.name && this.state.password && this.state.passwordConfirm)
        });
    }

    pwChanged(ev) {
        this.setState({
            password: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.name && this.state.email && this.state.passwordConfirm)
        });
    }

    pwConfirmChanged(ev) {
        this.setState({
            passwordConfirm: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.name && this.state.email && this.state.password)
        });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isSignUping) {
            return;
        }

        let name = this.state.name;
        let email = this.state.email;
        let pw = this.state.password;
        let pwConfirm = this.state.passwordConfirm;

        if (!name) {
            return notify(this.props.t('Fill your name'), { type: 'warning' });
        } else if (!email) {
            return notify(this.props.t('Fill your email'), { type: 'warning' });
        } else if (!regex.emailStrict.test(email)) {
            return notify(this.props.t('Invalid email'), { type: 'warning' });
        } else if (!pw) {
            return notify(this.props.t('Fill your password'), { type: 'warning' });
        } else if (pw !== pwConfirm) {
            return notify(this.props.t('Password does not match'), { type: 'warning' });
        }

        return this.signup(name, email, pw);
    }

    signup(name, email, password) {
        this.setState({
            isSignUping: true,
            signupBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>' + this.props.t('Signing up') + '...'
        });

        let user = {
            email: email,
            password: password,
            name: name
        };

        return apiSign.signUp.do(user).then((response) => {
            let jwt = response.jwt;
            let users = response.data;
            let userId = Object.keys(users).shift();
            let _user = users[userId];
            cookieHlp.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHlp.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            authHlp.jwt = jwt;
            authHlp.activateRefreshToken();

            // this.props.history.replace(ROUTES.SETTINGS);
            window.location.replace(ROUTES.SETTINGS);
        }).catch((err) => {
            this.setState({
                isSignUping: false,
                signupBtnHtml: this.props.t('Sign up')
            });

            switch (err.msg) {
                case NAME_WAS_EMPTY:
                    return notify(this.props.t('Name was empty!'), { type: 'danger' });
                case EMAIL_WAS_EMPTY:
                    return notify(this.props.t('Email was empty!'), { type: 'danger' });
                case PASSWORD_WAS_EMPTY:
                    return notify(this.props.t('Password was empty!'), { type: 'danger' });
                case USER_EMAIL_HAD_BEEN_SIGNED_UP:
                    return notify(this.props.t('User email had been signed up!'), { type: 'danger' });
                default:
                    return notify(this.props.t('An error occurred!'), { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="signup-container w-100">
                <SignForm title={this.props.t('Sign up')} subTitle={this.props.t('No fee. Experience chat now.')} onSubmit={this.checkInputs}>
                    <div className="form-group">
                        <div className="input-group">
                            <div className="chsr input-group-prepend">
                                <span className="input-group-text w-100 justify-content-center">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>

                            <input
                                type="text"
                                className="form-control"
                                placeholder={this.props.t('Name')}
                                value={this.state.name}
                                onChange={this.nameChanged}
                                required />
                        </div>
                    </div>
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
                                placeholder={this.props.t('Password')}
                                value={this.state.password}
                                onChange={this.pwChanged}
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
                                placeholder={this.props.t('Confirm password')}
                                value={this.state.passwordConfirm}
                                onChange={this.pwConfirmChanged}
                                required />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="controls">
                            <button
                                type="submit"
                                className="btn btn-info"
                                disabled={!this.state.isInputReady || this.state.isSignuping}
                                dangerouslySetInnerHTML={{__html: this.state.signupBtnHtml}}>
                            </button>
                        </div>
                    </div>
                    <div className="my-4 text-center">
                        <p>
                            <span><Trans i18nKey="I agree Chatshier" /></span>
                            <a className="mx-1 link-text" href={CHATSHIER_CFG.URL.WWW + CHATSHIER_CFG.URL.TERMS} target="_blank" rel="noopener noreferrer"><Trans i18nKey="Terms" /></a>
                            <span>&amp;</span>
                            <a className="mx-1 link-text" href={CHATSHIER_CFG.URL.WWW + CHATSHIER_CFG.URL.PRIVACY} target="_blank" rel="noopener noreferrer"><Trans i18nKey="Privacy" /></a>
                        </p>
                        <Route render={(router) => (
                            <p>
                                <span><Trans i18nKey="Already have an account?" /></span>
                                <span className="mx-1 link-text" onClick={() => {
                                    router.history.push(ROUTES.SIGNIN);
                                }}><Trans i18nKey="Sign in" /></span>
                            </p>
                        )}></Route>
                    </div>
                </SignForm>
            </Fade>
        );
    }
}

export default withRouter(withTranslate(SignUp));
