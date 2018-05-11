import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import jwtDecode from 'jwt-decode';

import ROUTES from '../../config/route';
import browserHelper from '../../helpers/browser';
import apiSign from '../../helpers/apiSign/index';
import cookieHelper, { CHSR_COOKIE } from '../../helpers/cookie';
import authHelper from '../../helpers/authentication';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';

import './ChangePassword.css';

const JWT_HAD_EXPIRED = '-2';
const USER_FAILED_TO_FIND = '3.1';
const NEW_PASSWORD_WAS_INCONSISTENT = '2.4';

class ChangePassword extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            password: '',
            passwordCfm: '',
            isProcessing: false,
            submitBtnHtml: '確認'
        };

        this.passwordChanged = this.passwordChanged.bind(this);
        this.passwordCfmChanged = this.passwordCfmChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);

        let errCode = this._getParameterByName('errcode');
        if (errCode === JWT_HAD_EXPIRED) {
            this.state.isProcessing = true;
            this.props.history.replace(ROUTES.RESET_PASSWORD);
            notify('令牌已過期，請重新進行重設密碼流程', { type: 'danger' });
            return;
        } else if (errCode) {
            this.state.isProcessing = true;
            this.props.history.replace(ROUTES.SIGNIN);
            notify('發生錯誤！', { type: 'danger' });
            return;
        }

        // 只要 jwt 為空或者解譯錯誤都導回登入畫面
        this.jwtFromUrl = window.location.href.split('/').pop();
        if (!this.jwtFromUrl) {
            this.props.history.replace(ROUTES.SIGNIN);
            return;
        }

        try {
            this.payload = this.jwtFromUrl ? jwtDecode(this.jwtFromUrl) : {};
            if (this.payload.exp < Date.now()) {
                this.state.isProcessing = true;
                notify('令牌已過期，請重新進行重設密碼流程', { type: 'danger' });
                this.props.history.replace(ROUTES.RESET_PASSWORD);
            }
        } catch (ex) {
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentWillMount() {
        browserHelper.setTitle('設定密碼');

        if (authHelper.hasSignedin()) {
            return window.location.replace(ROUTES.CHAT);
        }
    }

    passwordChanged(ev) {
        this.setState({ password: ev.target.value });
    }

    passwordCfmChanged(ev) {
        this.setState({ passwordCfm: ev.target.value });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isProcessing) {
            return;
        }

        let password = this.state.password;
        let passwordCfm = this.state.passwordCfm;
        if (!password) {
            return notify('新密碼不能為空', { type: 'warning' });
        } else if (!passwordCfm || password !== passwordCfm) {
            return notify('輸入的新密碼不一致', { type: 'warning' });
        }

        return this.changePassword(password, passwordCfm);
    }

    /**
     * @param {string} password
     * @param {string} passwordCfm
     */
    changePassword(password, passwordCfm) {
        this.setState({
            isProcessing: true,
            submitBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>處理中...'
        });

        let userId = this.payload.uid;
        let user = {
            newPassword: password,
            newPasswordCfm: passwordCfm
        };
        return apiSign.changePassword.put(userId, user, this.jwtFromUrl).then((resJson) => {
            let jwt = resJson.jwt;
            let users = resJson.data;
            let _user = users[userId];

            cookieHelper.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHelper.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            authHelper.jwt = jwt;
            authHelper.activateRefreshToken();

            return notify('密碼更新成功！', { type: 'success' });
        }).then(() => {
            this.setState({
                isProcessing: false,
                submitBtnHtml: '確認'
            });
            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((err) => {
            this.setState({
                isProcessing: false,
                submitBtnHtml: '確認'
            });

            if (0 === err.message.indexOf('401')) {
                return Promise.all([
                    notify('不合法的令牌，請重新進行重設密碼流程', { type: 'danger' }),
                    this.props.history.replace(ROUTES.RESET_PASSWORD)
                ]);
            } else if (NEW_PASSWORD_WAS_INCONSISTENT === err.code) {
                return notify('輸入的新密碼不一致', { type: 'danger' });
            } else if (USER_FAILED_TO_FIND === err.code) {
                return notify('找不到使用者！', { type: 'danger' });
            } else if (JWT_HAD_EXPIRED === err.code) {
                return Promise.all([
                    notify('令牌已過期，請重新進行重設密碼流程', { type: 'danger' }),
                    this.props.history.replace(ROUTES.RESET_PASSWORD)
                ]);
            }
            return notify('設定新密碼失敗', { type: 'danger' });
        });
    }

    render() {
        return (
            <Fade in className="reset-container w-100">
                <SignForm title="設定您的新密碼" onSubmit={this.checkInputs}>
                    <fieldset className="mb-4">
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
                                    placeholder="新密碼"
                                    value={this.state.password}
                                    onChange={this.passwordChanged}
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
                                    placeholder="確認新密碼"
                                    value={this.state.passwordCfm}
                                    onChange={this.passwordCfmChanged}
                                    required />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="controls">
                                <button
                                    type="submit"
                                    className="btn btn-info"
                                    disabled={this.state.isProcessing}
                                    dangerouslySetInnerHTML={{__html: this.state.submitBtnHtml}}>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </SignForm>
            </Fade>
        );
    }

    /**
     * @param {string} name
     * @param {string} [url]
     */
    _getParameterByName(name, url) {
        url = url || window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');

        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        let results = regex.exec(url);

        if (!results) {
            return null;
        } else if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

export default withRouter(ChangePassword);
