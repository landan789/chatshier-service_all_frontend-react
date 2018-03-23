import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import urlConfig from '../../config/url';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import apiSign from '../../helpers/apiSign/index';
import { setJWT } from '../../helpers/databaseApi/index';
import regex from '../../utils/regex';
import { notify } from '../../components/Notify/Notify';

import './SignUp.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '');

const TOOLTIP = {
    'SIGNUP_NAME': '請輸入姓名',
    'SIGNUP_EMAIL': '請輸入電子郵件',
    'SIGNUP_PASSWORD': '請輸入密碼',
    'SIGNUP_PASSWORD_CONFIRM': '與密碼不相符',
    'EMAIL_ALREADY_IN_USE': '此電子郵件已註冊',
    'INVALID_EMAIL': '無效電子郵件',
    'OPERATION_NOT_ALLOWED': '操作不允許',
    'WEAK_PASSWORD': '密碼強度低'
};

const NAME_WAS_EMPTY = 'name was empty';
const EMAIL_WAS_EMPTY = 'EMAIL was empty';
const PASSWORD_WAS_EMPTY = 'password was empty';
const USER_EMAIL_HAD_BEEN_SIGNED_UP = 'user email had been signed up';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignUping: false,
            signupBtnHtml: '註冊',
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

    componentWillMount() {
        browserHelper.setTitle('註冊');

        if (cookieHelper.hasSignedin()) {
            window.location.replace(ROUTES.CHAT);
        }
        return authHelper.signOut();
    }

    nameChanged(ev) {
        this.setState({ name: ev.target.value });
    }

    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    pwChanged(ev) {
        this.setState({ password: ev.target.value });
    }

    pwConfirmChanged(ev) {
        this.setState({ passwordConfirm: ev.target.value });
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
            return notify(TOOLTIP.SIGNUP_NAME, { type: 'warning' });
        } else if (!email) {
            return notify(TOOLTIP.SIGNUP_EMAIL, { type: 'warning' });
        } else if (!regex.emailStrict.test(email)) {
            return notify(TOOLTIP.INVALID_EMAIL, { type: 'warning' });
        } else if (!pw) {
            return notify(TOOLTIP.SIGNUP_PASSWORD, { type: 'warning' });
        } else if (pw !== pwConfirm) {
            return notify(TOOLTIP.SIGNUP_PASSWORD_CONFIRM, { type: 'warning' });
        }

        return this.signup(name, email, pw);
    }

    signup(name, email, password) {

        this.setState({
            isSignUping: true,
            signupBtnHtml: '<i class="fas fa-circle-notch fa-spin"></i> 註冊中...'
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
            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            window.localStorage.setItem('jwt', jwt);
            setJWT(jwt);
            this.setState({
                isSignUping: false,
                signupBtnHtml: '註冊'
            });
            return Promise.resolve();
        }).then(() => {
            this.setState({
                isSignUping: false,
                signupBtnHtml: '註冊'
            });
            
            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((err) => {
            this.setState({
                isSignUping: false,
                signupBtnHtml: '註冊'
            });
            switch (err.msg) {
                case NAME_WAS_EMPTY:
                    notify('姓名未填寫', { type: 'danger' });
                    break;
                case EMAIL_WAS_EMPTY:
                    notify('email 未填寫！', { type: 'danger' });
                    break;
                case PASSWORD_WAS_EMPTY:
                    notify('密碼未填寫！', { type: 'danger' });
                    break;
                case USER_EMAIL_HAD_BEEN_SIGNED_UP:
                    notify('email 已被註冊！', { type: 'danger' });
                    break;
                default:
                    notify('錯誤！', { type: 'danger' });
                    break;
            }
            return;
        });
    }

    render() {
        return (
            <Fade in className="signup-container">
                <div className="col-md-12 text-center logo-container">
                    <a className="chatshier-logo" href={wwwUrl}>
                        <img alt="Chatshier-logo" src="image/logo.png" />
                    </a>
                </div>

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <div className="form-container col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">
                            <h2 className="text-center signup-title">開始體驗您的Chatshier</h2>
                            <p className="text-center lead">不需付費。馬上體驗聊天功能。</p>
                            <form className="signup-form" onSubmit={this.checkInputs}>
                                <fieldset>
                                    <div className="form-group">
                                        <div className="input-group padding-left-right">
                                            <div className="chsr input-group-prepend">
                                                <span className="input-group-text w-100 justify-content-center">
                                                    <i className="fas fa-user"></i>
                                                </span>
                                            </div>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="姓名"
                                                value={this.state.name}
                                                onChange={this.nameChanged}
                                                required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group padding-left-right">
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
                                                required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group padding-left-right">
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
                                    <div className="form-group">
                                        <div className="input-group padding-left-right">
                                            <div className="chsr input-group-prepend">
                                                <span className="input-group-text w-100 justify-content-center">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                            </div>

                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="確認密碼"
                                                value={this.state.passwordConfirm}
                                                onChange={this.pwConfirmChanged}
                                                required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="controls padding-left-right">
                                            <button
                                                type="submit"
                                                className="btn btn-info"
                                                disabled={this.state.isSignuping}
                                                dangerouslySetInnerHTML={{__html: this.state.signupBtnHtml}}>
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="text-center signup-option">
                                    <p>
                                        我同意 Chatshier
                                        <a className="link-text" href="https://www.chatshier.com/terms.html" target="_blank" rel="noopener noreferrer">服務條款</a>
                                            &amp;
                                        <a className="link-text" href="https://www.chatshier.com/privacy.html" target="_blank" rel="noopener noreferrer">隱私權條款</a>
                                    </p>
                                    <Route render={(router) => (
                                        <p>
                                            已經有帳號了嗎？請按
                                            <span className="link-text" onClick={() => {
                                                router.history.push('/signin');
                                            }}>這裡</span>
                                            登入。
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

SignUp.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(SignUp);
