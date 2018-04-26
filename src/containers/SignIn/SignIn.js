import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import urlConfig from '../../config/url';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import apiSign from '../../helpers/apiSign/index';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';

import { notify } from '../../components/Notify/Notify';

import './SignIn.css';

const USER_FAILED_TO_FIND = 'user failed to find';
const PASSWORD_WAS_INCORRECT = 'password was incorrect';
const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl
    ? URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '')
    : window.location.protocol + '//' + document.domain.replace(regex.domainPrefix, 'www.');

class SignIn extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isSignIning: false,
            signInBtnHtml: '登入',
            email: '',
            password: ''
        };

        this.emailChanged = this.emailChanged.bind(this);
        this.pwChanged = this.pwChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('登入');

        if (authHelper.hasSignedin()) {
            window.location.replace(ROUTES.CHAT);
        }
    }

    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    pwChanged(ev) {
        this.setState({ password: ev.target.value });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isSignIning) {
            return;
        }

        let email = this.state.email;
        let pw = this.state.password;

        if (!regex.emailStrict.test(email)) {
            return notify('無效電子郵件', { type: 'warning' });
        } else if (!pw) {
            return notify('請輸入密碼', { type: 'warning' });
        }

        return this.signIn(email, pw);
    }

    signIn(email, password) {
        this.setState({
            isSignIning: true,
            signInBtnHtml: '<i class="fas fa-circle-notch fa-spin"></i> 登入中...'
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

            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            authHelper.jwt = jwt;
            authHelper.activateRefreshToken();

            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((err) => {
            this.setState({
                isSignIning: false,
                signInBtnHtml: '登入'
            });

            switch (err.msg) {
                case USER_FAILED_TO_FIND:
                    notify('找不到使用者', { type: 'danger' });
                    break;
                case PASSWORD_WAS_INCORRECT:
                    notify('密碼錯誤！', { type: 'danger' });
                    break;
                default:
                    notify('錯誤！', { type: 'danger' });
                    break;
            }
        });
    }

    render() {
        return (
            <Fade in className="signin-container w-100">
                <div className="col-12 text-center logo-container">
                    <a className="chatshier-logo" href={wwwUrl}>
                        <img alt="Chatshier-logo" src="image/logo.png" />
                    </a>
                </div>

                <div className="mx-auto col-md-12 col-lg-6">
                    <div className="row justify-content-center">
                        <div className="form-container col-12 col-sm-10 col-md-8 col-lg-12">
                            <h2 className="text-center signin-title">登入</h2>
                            <form className="signin-form" onSubmit={this.checkInputs}>
                                <fieldset>
                                    <div className="form-group padding-left-right">
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
                                                placeholder="電子郵件"
                                                value={this.state.email}
                                                onChange={this.emailChanged}
                                                autoCapitalize="none"
                                                autoCorrect="off"
                                                spellCheck="false"
                                                autoFocus="true"
                                                required />
                                        </div>
                                    </div>
                                    <div className="form-group padding-left-right">
                                        <div className="input-group">
                                            <div className="chsr input-group-prepend">
                                                <span className="input-group-text w-100 justify-content-center">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                            </div>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="密碼"
                                                value={this.state.password}
                                                onChange={this.pwChanged}
                                                required />
                                        </div>
                                    </div>
                                    <div className="form-group padding-left-right">
                                        <label className="control-label"></label>
                                        <div className="controls">
                                            <button
                                                type="submit"
                                                className="btn btn-info"
                                                disabled={this.state.isSignIning}
                                                dangerouslySetInnerHTML={{__html: this.state.signInBtnHtml}}>
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="text-center signin-trouble">
                                    <Route render={(router) => (
                                        <p>
                                            忘記密碼？請按
                                            <span className="link-text" onClick={() => {}}>這裡</span>
                                            重設密碼。
                                        </p>
                                    )}></Route>
                                    <Route render={(router) => (
                                        <p>
                                            還沒有帳號嗎請按
                                            <span className="link-text" onClick={() => {
                                                router.history.push(ROUTES.SIGNUP);
                                            }}>這裡</span>
                                            註冊。
                                        </p>
                                    )}></Route>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Fade>
        );
    }
}

SignIn.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(SignIn);
