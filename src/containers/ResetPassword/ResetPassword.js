import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import apiSign from '../../helpers/apiSign/index';
import cookieHelper from '../../helpers/cookie';
import regex from '../../utils/regex';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';
import GoogleRecaptcha from '../../components/GoogleRecaptcha/GoogleRecaptcha';

import './ResetPassword.css';

const PASSWORD_FAILED_TO_RESET = '2.3';
const USER_FAILED_TO_FIND = '3.1';

class ResetPassword extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            recaptchaResponse: '',
            isProcessing: false,
            resetBtnHtml: '重設密碼'
        };

        /** @type {GoogleRecaptcha} */
        this.recaptchaCmp = null;

        this.emailChanged = this.emailChanged.bind(this);
        this.recaptchaResponseChanged = this.recaptchaResponseChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('重設密碼');

        if (cookieHelper.hasSignedin()) {
            window.location.replace(ROUTES.CHAT);
        }
    }
    emailChanged(ev) {
        this.setState({ email: ev.target.value });
    }

    recaptchaResponseChanged(recaptchaResponse) {
        this.setState({ recaptchaResponse: recaptchaResponse });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isProcessing) {
            return;
        }

        let email = this.state.email;
        let recaptchaResponse = this.state.recaptchaResponse;
        if (!regex.emailStrict.test(email)) {
            return notify('無效電子郵件', { type: 'warning' });
        } else if (!recaptchaResponse) {
            return notify('請執行驗證動作', { type: 'warning' });
        }

        return this.forgetPassword(email, recaptchaResponse);
    }

    /**
     * @param {string} email
     * @param {string} recaptchaResponse
     */
    forgetPassword(email, recaptchaResponse) {
        this.setState({
            isProcessing: true,
            resetBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>處理中...'
        });

        let user = {
            email: email,
            recaptchaResponse: recaptchaResponse
        };
        return apiSign.resetPassword.do(user).then(() => {
            this.setState({
                isProcessing: false,
                resetBtnHtml: '重設密碼'
            });
            return notify('已發送 email 至您的信箱', { type: 'success' });
        }).then(() => {
            this.props.history.push(ROUTES.SIGNIN);
        }).catch((err) => {
            this.setState({
                isProcessing: false,
                resetBtnHtml: '重設密碼'
            });
            this.recaptchaCmp && this.recaptchaCmp.resetWidget();

            switch (err.code) {
                case PASSWORD_FAILED_TO_RESET:
                    return notify('不合法的驗證碼，請重新進行驗證動作！', { type: 'danger' });
                case USER_FAILED_TO_FIND:
                    return notify('找不到使用者！', { type: 'danger' });
                default:
                    return notify('處理失敗！', { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="reset-container w-100">
                <SignForm title="重設密碼" onSubmit={this.checkInputs}>
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
                        <GoogleRecaptcha className="form-group"
                            onResponse={this.recaptchaResponseChanged}
                            ref={(cmp) => (this.recaptchaCmp = cmp)}>
                        </GoogleRecaptcha>
                        <div className="form-group">
                            <div className="controls">
                                <button
                                    type="submit"
                                    className="btn btn-info"
                                    disabled={this.state.isProcessing}
                                    dangerouslySetInnerHTML={{__html: this.state.resetBtnHtml}}>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                    <div className="my-4 text-center">
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

export default withRouter(ResetPassword);
