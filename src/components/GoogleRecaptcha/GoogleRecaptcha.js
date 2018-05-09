import React from 'react';
import PropTypes from 'prop-types';

import './GoogleRecaptcha.css';

const API_SCRIPT = 'https://www.google.com/recaptcha/api.js';
const sitekey = '6LecPVgUAAAAAEYs-SXcfPJYxUDp4X-Xh3gisF-q';
let isLoadedScript = false;

class GoogleRecaptcha extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        onResponse: PropTypes.func.isRequired
    }

    static defaultProps = {
        className: ''
    }

    constructor(props, ctx) {
        super(props, ctx);

        let readyResolve;
        this.ready = new Promise((resolve) => {
            readyResolve = resolve;
        });
        this.widgetId = -1;

        if (!isLoadedScript) {
            let language =
                (navigator.languages && navigator.languages[0]) ||
                navigator.language ||
                navigator.userLanguage;
            let recaptchaScript = document.createElement('script');
            recaptchaScript.onload = () => window.grecaptcha.ready(readyResolve);
            recaptchaScript.async = recaptchaScript.defer = true;
            recaptchaScript.src = API_SCRIPT + '?render=explicit&hl=' + language;
            document.head.appendChild(recaptchaScript);
            isLoadedScript = true;
        } else {
            window.grecaptcha.ready(readyResolve);
        }

        this.initGoogleRecaptcha = this.initGoogleRecaptcha.bind(this);
    }

    resetWidget() {
        this.widgetId >= 0 && window.grecaptcha.reset(this.widgetId);
    }

    recaptchaSuccess(recaptchaResponse) {
        this.props.onResponse(recaptchaResponse);
    }

    recaptchaError(err) {
        console.error(err);
        this.resetWidget();
    }

    initGoogleRecaptcha(elem) {
        return this.ready.then(() => {
            this.widgetId >= 0 && window.grecaptcha.reset(this.widgetId);
            if (!elem) {
                return;
            }

            this.widgetId = window.grecaptcha.render(elem, {
                sitekey: sitekey,
                theme: 'light', // dark, light
                size: 'normal', // compact, normal
                tabindex: 2,
                callback: this.recaptchaSuccess.bind(this),
                'expired-callback': this.resetWidget.bind(this),
                'error-callback': this.recaptchaError.bind(this)
            });
        });
    }

    render() {
        let className = this.props.className + ' my-3 recaptcha-container';
        return (
            <div className={className.trim()}>
                <div className="g-recaptcha" ref={this.initGoogleRecaptcha}></div>
            </div>
        );
    }
}

export default GoogleRecaptcha;
