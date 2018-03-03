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
            isSignining: false,
            signinBtnHtml: '登入',
            email: '',
            password: ''
        };

        this.emailChanged = this.emailChanged.bind(this);
        this.pwChanged = this.pwChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    componentWillMount() {
        browser.setTitle('登入');
    }

    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    pwChanged(ev) {
        this.setState({ password: ev.target.value });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isSignining) {
            return;
        }

        let email = this.state.email;
        let pw = this.state.password;

        if (!regex.emailStrict.test(email)) {
            return notify('無效電子郵件', { type: 'warning' });
        } else if (!pw) {
            return notify('請輸入密碼', { type: 'warning' });
        }

        return this.signin(email, pw);
    }

    signin(email, pw) {
        let auth = firebase.auth();

        this.setState({
            isSignining: true,
            signinBtnHtml: '<i class="fa fa-circle-o-notch fa-spin"></i> 登入中...'
        });

        return auth.signInWithEmailAndPassword(email, pw).then(() => {
            return auth.currentUser.getIdToken();
        }).then((jwt) => {
            this.setState({
                isSignining: false,
                signinBtnHtml: '登入'
            });

            let name = auth.currentUser.displayName;
            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, email);
            window.localStorage.setItem('jwt', jwt);

            // this.props.history.replace('/chat');
            window.location.replace('/chat');
        }).catch((error) => {
            this.setState({
                isSignining: false,
                signinBtnHtml: '登入'
            });

            let errCode = error ? error.code : null;
            switch (errCode) {
                case 'auth/user-not-found':
                    return notify('找不到使用者', { type: 'danger' });
                case 'auth/wrong-password':
                    return notify('密碼錯誤！', { type: 'danger' });
                default:
                    break;
            }
        });
    }

    render() {
        return (
            <Fade in className="signin-container">
                <div className="chsr col-md-12 text-center signin-logo">
                    <div>
                        <img alt="Chatshier-logo" src="image/logo.png" />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <div className="form-content col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">
                            <h2 className="text-center signin-title">登入</h2>
                            <div className="form-container">
                                <form className="form-horizontal" onSubmit={this.checkInputs}>
                                    <fieldset>
                                        <div className="form-group padding-left-right">
                                            <div className="input-group">
                                                <div className="chsr input-group-prepend">
                                                    <span className="input-group-text w-100 justify-content-center">
                                                        <i className="fa fa-envelope"></i>
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
                                                        <i className="fa fa-lock"></i>
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
                                                    disabled={this.state.isSignining}
                                                    dangerouslySetInnerHTML={{__html: this.state.signinBtnHtml}}>
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
