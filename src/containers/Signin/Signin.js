import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import firebase from 'firebase';

import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';

import { notify } from '../../components/Notify/Notify';

import './Signin.css';

class Signin extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: ''
        };

        this.emailChanged = this.emailChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    passwordChanged(ev) {
        this.setState({ password: ev.target.value });
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
        }).catch((error) => {
            if ('auth/wrong-password' !== error.code) {
                return notify('找不到使用者', { type: 'danger' });
            }

            return notify('密碼錯誤！', { type: 'danger' });
        });
    }

    render() {
        return (
            <div className="signin-container">
                <div className="chsr col-md-12 text-center signin-logo">
                    <a id="index" href="index.html">
                        <img alt="Chatshier-logo" src="image/png/logo.png" />
                    </a>
                </div>

                <div className="col-md-12 column wh-reg-step-login">
                    <div className="row justify-content-center">
                        <div className="col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 form-content">
                            <h2 className="text-center login-title">登入</h2>
                            <div className="form-container">
                                <form className="form-horizontal">
                                    <fieldset>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group ">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-envelope"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="電子郵件" value={this.state.email} onChange={this.emailChanged} required />
                                            </div>
                                        </div>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-lock"></i>
                                                    </span>
                                                </div>
                                                <input type="password" className="form-control" placeholder="密碼" value={this.state.password} onChange={this.passwordChanged} required />
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
                                    <div className="text-center forget-password">
                                        <Route render={(router) => (
                                            <p>
                                                忘記密碼？請按
                                                <a onClick={() => {}}>這裡</a>
                                                重設密碼。
                                            </p>
                                        )}></Route>
                                        <Route render={(router) => (
                                            <p>
                                                還沒有帳號嗎請按
                                                <a onClick={() => {
                                                    router.history.push('/signup');
                                                }}>這裡</a>
                                                註冊。
                                            </p>
                                        )}></Route>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;
