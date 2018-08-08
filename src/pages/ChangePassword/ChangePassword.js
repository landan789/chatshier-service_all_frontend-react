import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import { withTranslate } from '../../i18n';
import jwtDecode from 'jwt-decode';

import ROUTES from '../../config/route';
import browserHlp from '../../helpers/browser';
import apiSign from '../../helpers/apiSign/index';
import cookieHlp, { CHSR_COOKIE } from '../../helpers/cookie';
import authHlp from '../../helpers/authentication';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';

import './ChangePassword.css';

const JWT_HAD_EXPIRED = '-2';
const USER_FAILED_TO_FIND = '3.1';
const NEW_PASSWORD_WAS_INCONSISTENT = '2.4';

class ChangePassword extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            password: '',
            passwordCfm: '',
            isInputReady: false,
            isProcessing: false,
            submitBtnHtml: this.props.t('Confirm')
        };

        this.passwordChanged = this.passwordChanged.bind(this);
        this.passwordCfmChanged = this.passwordCfmChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);

        // 只要 jwt 為空或者解譯錯誤都導回登入畫面
        this.jwt = this._getUrlQueryByName('j');
        if (!this.jwt) {
            this.props.history.replace(ROUTES.SIGNIN);
            return;
        }

        try {
            this.payload = this.jwt ? jwtDecode(this.jwt) : {};
            if (this.payload.exp < Date.now()) {
                this.state.isProcessing = true;
                notify(this.props.t('Token expired, please perform the reset password procedure again!'), { type: 'danger' });
                this.props.history.replace(ROUTES.RESET_PASSWORD);
            }
        } catch (ex) {
            this.props.history.replace(ROUTES.SIGNIN);
        }

        browserHlp.setTitle(this.props.t('Change password'));
        if (authHlp.hasSignedin()) {
            return window.location.replace(ROUTES.CHAT);
        }
    }

    passwordChanged(ev) {
        this.setState({
            password: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.passwordCfm)
        });
    }

    passwordCfmChanged(ev) {
        this.setState({
            passwordCfm: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.password)
        });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isProcessing) {
            return;
        }

        let password = this.state.password;
        let passwordCfm = this.state.passwordCfm;
        if (!password) {
            return notify(this.props.t('New password can\'t be empty'), { type: 'warning' });
        } else if (!passwordCfm || password !== passwordCfm) {
            return notify(this.props.t('The entered new password is inconsistent'), { type: 'warning' });
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
            submitBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>' + this.props.t('Processing') + '...'
        });

        let userId = this.payload.uid;
        let user = {
            newPassword: password,
            newPasswordCfm: passwordCfm
        };
        return apiSign.changePassword.put(userId, user, this.jwt).then((resJson) => {
            let jwt = resJson.jwt;
            let users = resJson.data;
            let _user = users[userId];

            cookieHlp.setCookie(CHSR_COOKIE.USER_NAME, _user.name);
            cookieHlp.setCookie(CHSR_COOKIE.USER_EMAIL, _user.email);
            authHlp.jwt = jwt;
            authHlp.activateRefreshToken();

            return notify(this.props.t('Password update successful!'), { type: 'success' });
        }).then(() => {
            this.setState({
                isProcessing: false,
                submitBtnHtml: this.props.t('Confirm')
            });
            // this.props.history.replace(ROUTES.CHAT);
            window.location.replace(ROUTES.CHAT);
        }).catch((err) => {
            this.setState({
                isProcessing: false,
                submitBtnHtml: this.props.t('Confirm')
            });

            if (401 === err.status) {
                return Promise.all([
                    notify(this.props.t('Invalid token, please perform the reset password procedure again!'), { type: 'danger' }),
                    this.props.history.replace(ROUTES.RESET_PASSWORD)
                ]);
            } else if (NEW_PASSWORD_WAS_INCONSISTENT === err.code) {
                return notify(this.props.t('New password was inconsistent'), { type: 'danger' });
            } else if (USER_FAILED_TO_FIND === err.code) {
                return notify(this.props.t('No user found'), { type: 'danger' });
            } else if (JWT_HAD_EXPIRED === err.code) {
                return Promise.all([
                    notify(this.props.t('Token expired, please perform the reset password procedure again!'), { type: 'danger' }),
                    this.props.history.replace(ROUTES.RESET_PASSWORD)
                ]);
            }
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    render() {
        return (
            <Fade in className="reset-container w-100">
                <SignForm title={this.props.t('Set your new password')} onSubmit={this.checkInputs}>
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
                                    placeholder={this.props.t('New password')}
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
                                    placeholder={this.props.t('Confirm new password')}
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
                                    disabled={!this.state.isInputReady || this.state.isProcessing}
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
    _getUrlQueryByName(name, url) {
        name = name.replace(/[[\]]/g, '\\$&');
        url = url || window.location.href;
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        let results = regex.exec(url);

        if (!results) {
            return;
        } else if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

export default withRouter(withTranslate(ChangePassword));
