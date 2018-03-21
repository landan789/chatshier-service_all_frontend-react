import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import firebase from 'firebase';

import ROUTES from '../../config/route';
import urlConfig from '../../config/url';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import { setJWT } from '../../helpers/databaseApi/index';
import regex from '../../utils/regex';

import { notify } from '../../components/Notify/Notify';

import './SignIn.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '');

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

        if (cookieHelper.hasSignedin()) {
            window.location.replace(ROUTES.CHAT);
        }
        return authHelper.signOut();
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

    signIn(email, pw) {
        let auth = firebase.auth();

        this.setState({
            isSignIning: true,
            signInBtnHtml: '<i class="fas fa-circle-notch fa-spin"></i> 登入中...'
        });

        return auth.signInWithEmailAndPassword(email, pw).then(() => {
            return auth.currentUser.getIdToken();
        }).then((jwt) => {
            this.setState({
                isSignIning: false,
                signInBtnHtml: '登入'
            });

            let name = auth.currentUser.displayName;
            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, email);
            window.localStorage.setItem('jwt', jwt);
            setJWT(jwt);

            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((error) => {
            this.setState({
                isSignIning: false,
                signInBtnHtml: '登入'
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
                <div className="col-md-12 text-center logo-container">
                    <a className="chatshier-logo" href={wwwUrl}>
                        <img alt="Chatshier-logo" src="image/logo.png" />
                    </a>
                </div>

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <div className="form-container col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3">
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