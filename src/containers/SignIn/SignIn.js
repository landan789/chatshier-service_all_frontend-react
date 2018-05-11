import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import authHelper from '../../helpers/authentication';
import apiSign from '../../helpers/apiSign/index';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import regex from '../../utils/regex';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';

import './SignIn.css';

const USER_FAILED_TO_FIND = 'user failed to find';
const PASSWORD_WAS_INCORRECT = 'password was incorrect';

class SignIn extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

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
            signInBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>登入中...'
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
                    return notify('找不到使用者', { type: 'danger' });
                case PASSWORD_WAS_INCORRECT:
                    return notify('密碼錯誤！', { type: 'danger' });
                default:
                    return notify('發生錯誤！', { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="signin-container w-100">
                <SignForm title="登入" onSubmit={this.checkInputs}>
                    <fieldset>
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
                                    placeholder="電子郵件"
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
                                    placeholder="密碼"
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
                                    disabled={this.state.isSignIning}
                                    dangerouslySetInnerHTML={{__html: this.state.signInBtnHtml}}>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                    <div className="my-4 text-center">
                        <Route render={(router) => (
                            <p>
                                <span>忘記密碼？請按</span>
                                <span className="mx-1 link-text" onClick={() => {
                                    router.history.push(ROUTES.RESET_PASSWORD);
                                }}>重設密碼</span>
                            </p>
                        )}></Route>
                        <Route render={(router) => (
                            <p>
                                <span>還沒有帳號嗎？請按</span>
                                <span className="mx-1 link-text" onClick={() => {
                                    router.history.push(ROUTES.SIGNUP);
                                }}>註冊</span>
                            </p>
                        )}></Route>
                    </div>
                </SignForm>
            </Fade>
        );
    }
}

export default withRouter(SignIn);
