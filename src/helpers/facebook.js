import { currentLanguage } from '../i18n';
import chatshierCfg from '../config/chatshier';

const FB_SDK_ID = 'facebook-jssdk';
const FB_SDK_URL = 'https://connect.facebook.net/' + currentLanguage + '/sdk.js';
/** @type {fb.InitParams} */
const FB_PARAMS = chatshierCfg.FACEBOOK;

class FacebookHelper {
    constructor() {
        /** @type {fb.FacebookStatic} */
        this.FB = null;
        this.initPromise = null;
        this.init();
    }

    /**
     * 有需要使用時才 fetch facebook js sdk
     */
    loadAPI() {
        let sdkScript = document.getElementById(FB_SDK_ID);
        if (sdkScript) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            sdkScript = document.createElement('script');
            sdkScript.id = FB_SDK_ID;
            sdkScript.async = sdkScript.defer = true;
            sdkScript.onload = (ev) => {
                this.FB = window.FB;
                sdkScript.onload = sdkScript.onerror = void 0;
                resolve(ev);
            };
            sdkScript.onerror = (ev) => {
                sdkScript.onload = sdkScript.onerror = void 0;
                reject(ev);
            };
            sdkScript.src = FB_SDK_URL;
            document.head.appendChild(sdkScript);
        });
    }

    /**
     * @returns {Promise<fb.AuthResponse>}
     */
    init(configUrl) {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this.loadAPI().then(() => {
            this.FB.init(FB_PARAMS);
            return new Promise((resolve) => this.FB.getLoginStatus(resolve));
        });
        return this.initPromise;
    }

    getFanPages() {
        let apiPath = '/me/accounts';
        return this._sendAPI(apiPath);
    }

    getFanPagesPicture(pageId, pageToken) {
        let apiPath = '/' + pageId + '/picture?access_token=' + pageToken + '&redirect=false';
        return this._sendAPI(apiPath);
    }

    getFanPageDetail(pageId) {
        let apiPath = '/' + pageId;
        return this._sendAPI(apiPath);
    }

    getFanPageSubscribeApp(pageId, pageToken) {
        let apiPath = '/' + pageId + '/subscribed_apps?access_token=' + pageToken;
        return this._sendAPI(apiPath);
    }

    setFanPageSubscribeApp(pageId, pageToken) {
        let apiPath = '/' + pageId + '/subscribed_apps?access_token=' + pageToken;
        return this._sendAPI(apiPath, 'POST');
    }

    /**
     * @returns {Promise<fb.AuthResponse>}
     */
    signIn() {
        return new Promise((resolve) => this.FB.login(resolve, { scope: 'email' }));
    }

    /**
     * @returns {Promise<fb.AuthResponse>}
     */
    signInForPages() {
        /** @type {fb.LoginOptions} */
        let fbOpts = {
            auth_type: 'reauthenticate',
            scope: 'manage_pages,pages_messaging,pages_messaging_subscriptions',
            return_scopes: true
        };
        return new Promise((resolve) => this.FB.login(resolve, fbOpts));
    }

    /**
     * @returns {Promise<fb.AuthResponse>}
     */
    signOut() {
        return new Promise((resolve) => this.FB.logout(resolve));
    }

    _sendAPI(apiPath, method) {
        method = method || 'GET';
        return new Promise((resolve, reject) => {
            this.FB.api(apiPath, method, (res) => {
                if (!res || (res && res.error)) {
                    return reject(res.error);
                }
                resolve(res);
            });
        });
    }
}

export default new FacebookHelper();
