import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { Fade } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import browserHlp from '../../helpers/browser';
import apiSign from '../../helpers/apiSign/index';
import authHlp from '../../helpers/authentication';
import regex from '../../utils/regex';

import SignForm from '../../components/SignForm/SignForm';
import { notify } from '../../components/Notify/Notify';
import GoogleRecaptcha from '../../components/GoogleRecaptcha/GoogleRecaptcha';

import './ResetPassword.css';

const PASSWORD_FAILED_TO_RESET = '2.3';
const EMAIL_FAILED_TO_SEND = '2.5';
const USER_FAILED_TO_FIND = '3.1';

class ResetPassword extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            recaptchaResponse: '',
            isInputReady: false,
            isProcessing: false,
            resetBtnHtml: this.props.t('Reset password')
        };

        /** @type {GoogleRecaptcha} */
        this.recaptchaCmp = null;

        this.emailChanged = this.emailChanged.bind(this);
        this.recaptchaResponseChanged = this.recaptchaResponseChanged.bind(this);
        this.checkInputs = this.checkInputs.bind(this);

        browserHlp.setTitle(this.props.t('Reset password'));
        if (authHlp.hasSignedin()) {
            window.location.replace(ROUTES.CHAT);
        }
    }

    emailChanged(ev) {
        this.setState({
            email: ev.target.value,
            isInputReady: !!(ev.target.value && this.state.recaptchaResponse)
        });
    }

    recaptchaResponseChanged(recaptchaResponse) {
        this.setState({
            recaptchaResponse: recaptchaResponse,
            isInputReady: !!(this.state.email && recaptchaResponse)
        });
    }

    checkInputs(ev) {
        ev && ev.preventDefault();
        if (this.state.isProcessing) {
            return;
        }

        let email = this.state.email;
        let recaptchaResponse = this.state.recaptchaResponse;
        if (!regex.emailStrict.test(email)) {
            return notify(this.props.t('Invalid email'), { type: 'warning' });
        } else if (!recaptchaResponse) {
            return notify(this.props.t('Please perform the verification'), { type: 'warning' });
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
            resetBtnHtml: '<i class="fas fa-circle-notch fa-fw fa-spin"></i>' + this.props.t('Processing') + '...'
        });

        let user = {
            email: email,
            recaptchaResponse: recaptchaResponse
        };
        return apiSign.resetPassword.do(user).then(() => {
            this.setState({
                isProcessing: false,
                resetBtnHtml: this.props.t('Reset password'),
                recaptchaResponse: ''
            });
            return notify(this.props.t('Sent email to your mailbox'), { type: 'success' });
        }).then(() => {
            this.props.history.push(ROUTES.SIGNIN);
        }).catch((err) => {
            this.recaptchaCmp && this.recaptchaCmp.resetWidget();
            this.setState({
                isProcessing: false,
                resetBtnHtml: this.props.t('Reset password'),
                recaptchaResponse: ''
            });

            switch (err.code) {
                case PASSWORD_FAILED_TO_RESET:
                    return notify(this.props.t('Invalid verification code, Please verify again!'), { type: 'danger' });
                case USER_FAILED_TO_FIND:
                    return notify(this.props.t('No user found'), { type: 'danger' });
                case EMAIL_FAILED_TO_SEND:
                    return notify(this.props.t('Sorry, unable to send email to your mailbox!'), { type: 'danger' });
                default:
                    return notify(this.props.t('An error occurred!'), { type: 'danger' });
            }
        });
    }

    render() {
        return (
            <Fade in className="reset-container w-100">
                <SignForm title={this.props.t('Reset password')} onSubmit={this.checkInputs}>
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
                                    placeholder={this.props.t('Email')}
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
                                    disabled={!this.state.isInputReady || this.state.isProcessing}
                                    dangerouslySetInnerHTML={{__html: this.state.resetBtnHtml}}>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                    <div className="my-4 text-center">
                        <Route render={(router) => (
                            <p>
                                <span><Trans i18nKey="Already have an account?" /></span>
                                <span className="mx-1 link-text" onClick={() => {
                                    router.history.push(ROUTES.SIGNIN);
                                }}><Trans i18nKey="Sign in" /></span>
                            </p>
                        )}></Route>
                    </div>
                </SignForm>
            </Fade>
        );
    }
}

export default withRouter(withTranslate(ResetPassword));
