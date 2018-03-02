import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import firebase from 'firebase';

import browser from '../../helpers/browser';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';

import { notify } from '../../components/Notify/Notify';

import './Signin.css';

class Signin extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: ''
        };

        this.emailChanged = this.emailChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.keyinSubmit = this.keyinSubmit.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    componentWillMount() {
        browser.setTitle('登入');
    }

    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    passwordChanged(ev) {
        this.setState({ password: ev.target.value });
    }

    keyinSubmit(ev) {
        if (13 !== ev.keyCode) {
            return;
        }

        return this.checkInputs();
    }

    checkInputs() {
        let email = this.state.email;
        let password = this.state.password;

        if (!regex.emailPattern.test(email)) {
            return notify('電子郵件格式不正確', { type: 'warning' });
        } else if (!password) {
            return notify('請輸入密碼', { type: 'warning' });
        }

        return this.signin(email, password);
    }

    signin(email, password) {
        let auth = firebase.auth();

        return auth.signInWithEmailAndPassword(email, password).then(() => {
            let currentUser = auth.currentUser;
            let userName = currentUser.displayName;
            let email = currentUser.email;

            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, userName);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, email);
            this.props.history.replace('/chat');
        }).catch((error) => {
            switch (error.code) {
                case 'auth/user-not-found':
                    return notify('找不到使用者', { type: 'danger' });
                case 'auth/wrong-password':
                default:
                    return notify('密碼錯誤！', { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="signin-container">
                <div className="chsr col-md-12 text-center signin-logo">
                    <div>
                        <img alt="Chatshier-logo" src="image/png/logo.png" />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <div className="form-content col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">
                            <h2 className="text-center signin-title">登入</h2>
                            <div className="form-container">
                                <form className="form-horizontal">
                                    <fieldset>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-envelope"></i>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="電子郵件"
                                                    value={this.state.email}
                                                    onChange={this.emailChanged}
                                                    onKeyDown={this.keyinSubmit}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                </div>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="密碼"
                                                    value={this.state.password}
                                                    onChange={this.passwordChanged}
                                                    onKeyDown={this.keyinSubmit}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <label className="control-label"></label>
                                            <div className="controls">
                                                {/* <button className="btn btn-info" data-loading-text="<i className='fa fa-circle-o-notch fa-spin'></i>登入中...">登入</button> */}
                                                <button type="button" className="btn btn-info" onClick={this.checkInputs}>登入</button>
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
                                                    router.history.push('/signup');
                                                }}>這裡</span>
                                                註冊。
                                            </p>
                                        )}></Route>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        );
    }
}

Signin.propTypes = {
    history: PropTypes.object
};

export default withRouter(Signin);
