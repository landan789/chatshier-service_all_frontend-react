import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import firebase from 'firebase';

import browser from '../../helpers/browser';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';
import { notify } from '../../components/Notify/Notify';

import './Signup.css';

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

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignuping: false,
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
        browser.setTitle('註冊');

        if (cookieHelper.hasSignedin()) {
            window.location.replace('/chat');
        }
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
        if (this.state.isSignuping) {
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

    signup(name, email, pw) {
        let auth = firebase.auth();
        let database = firebase.database();

        this.setState({
            isSignuping: true,
            signupBtnHtml: '<i class="fas fa-circle-notch fa-spin"></i> 註冊中...'
        });

        return auth.createUserWithEmailAndPassword(email, pw).then(() => {
            return auth.signInWithEmailAndPassword(email, pw);
        }).then(() => {
            return auth.currentUser.getIdToken();
        }).then((jwt) => {
            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, email);
            window.localStorage.setItem('jwt', jwt);

            // 更新 firebase 上 Authentication 的使用者個人資料
            let userProfile = {
                displayName: name,
                photoURL: ''
            };
            return auth.currentUser.updateProfile(userProfile);
        }).then(() => {
            // 更新 firebase 上 users 欄位的使用者資料
            let dateNow = Date.now();
            let userInfo = {
                createdTime: dateNow,
                updatedTime: dateNow,
                name: name,
                email: email
            };
            return database.ref('users/' + auth.currentUser.uid).set(userInfo);
        }).then(() => {
            // 從 firebase 發送 email 驗證信
            return auth.currentUser.sendEmailVerification();
        }).then(() => {
            this.setState({
                isSignuping: false,
                signupBtnHtml: '註冊'
            });

            // 非同步工作寫入完成後才進行網址跳轉動作
            this.props.history.replace('/chat');

            // popup 提醒 email 驗證信已發出
            return notify('已寄送 Email 驗證信', { type: 'success' });
        }).catch((error) => {
            this.setState({
                isSignuping: false,
                signupBtnHtml: '註冊'
            });

            let errCode = error ? error.code : null;
            switch (errCode) {
                case 'auth/email-already-in-use':
                    return notify(TOOLTIP.EMAIL_ALREADY_IN_USE, { type: 'danger' });
                case 'auth/invalid-email':
                    return notify(TOOLTIP.INVALID_EMAIL, { type: 'danger' });
                case 'auth/operation-not-allowed':
                    return notify(TOOLTIP.OPERATION_NOT_ALLOWED, { type: 'danger' });
                case 'auth/weak-password':
                    return notify(TOOLTIP.WEAK_PASSWORD, { type: 'danger' });
                default:
                    break;
            }
        });
    }

    render() {
        return (
            <Fade in className="signup-container">
                <div className="chsr col-md-12 text-center signup-logo">
                    <div className="logo-container">
                        <img alt="Chatshier-logo" src="image/logo.png" />
                    </div>
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
                                        <div className="input-group">
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
                                    <div className="error-notify"></div>
                                    <div className="form-group padding-left-right">
                                        <div className="controls">
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

Signup.propTypes = {
    history: PropTypes.object
};

export default withRouter(Signup);
