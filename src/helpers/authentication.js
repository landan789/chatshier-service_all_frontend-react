import jwtDecode from 'jwt-decode';
import cookieHelper, { CHSR_COOKIE } from './cookie';
import { MINUTE } from '../utils/unitTime';

import ROUTES from '../config/route';
import apiDatabase from './apiDatabase/index';
import apiSign from './apiSign/index';

// token 過期 5 分鐘前更新 token
const PREPARE_TIME = 5 * MINUTE;

class AuthenticationHelper {
    constructor() {
        /** @type {Chatshier.JWT} */
        this.payload = {};
        this.jwt = window.localStorage.getItem('jwt');
        this._refreshTimer = null;

        if (this.payload.exp) {
            // 如果載入頁面後，已經有登入但 jwt 已經過期
            // 代表已經關閉 chatshier 一段時間，此時將畫面導回至登入頁面
            // 反之則啟動自動更新 token 機制，讓用戶在開啟 chatshier 時保持 token 不過期
            if (this.payload.exp < Date.now()) {
                this.signOut();
                window.location.replace(ROUTES.SIGNIN);
                return;
            }
            this.activateRefreshToken();
        }
    }

    /**
     * @returns {string}
     */
    get userId() {
        return this.payload.uid || '';
    }

    /**
     * @param {string} value
     */
    set jwt(value = '') {
        this._jwt = value;
        if (this._jwt) {
            this.payload = jwtDecode(this._jwt) || {};
            window.localStorage.setItem('jwt', this._jwt);
        } else {
            this.payload = {};
            window.localStorage.removeItem('jwt');
        }
        apiDatabase.setJWT(this._jwt);
        apiSign.setJWT(this._jwt);
    }

    activateRefreshToken() {
        if (!this.payload.exp) {
            let jwt = window.localStorage.getItem('jwt');
            this.payload = jwt ? jwtDecode(jwt) : {};
        }

        if (this._refreshTimer || !this.payload.exp) {
            return Promise.resolve();
        }

        let waittingTime = Math.max(0, this.payload.exp - Date.now() - PREPARE_TIME);
        return this._keepToken(waittingTime);
    }

    /**
     * 清空登入使用的 cookie 及 localStorage 項目，執行登出
     */
    signOut() {
        cookieHelper.deleteCookie(CHSR_COOKIE.USER_NAME);
        cookieHelper.deleteCookie(CHSR_COOKIE.USER_EMAIL);
        this.jwt = '';
        return apiSign.signOut.do();
    }

    /**
     * @returns {boolean}
     */
    hasSignedin() {
        return !!(cookieHelper.getCookie(CHSR_COOKIE.USER_NAME) &&
            cookieHelper.getCookie(CHSR_COOKIE.USER_EMAIL) &&
            window.localStorage.getItem('jwt'));
    }

    /**
     * @param {number} waittingTime
     */
    _keepToken(waittingTime) {
        return new Promise((resolve) => {
            this._refreshTimer && window.clearTimeout(this._refreshTimer);
            this._refreshTimer = window.setTimeout(resolve, waittingTime);
        }).then(() => {
            return apiSign.refresh.do(this.payload.uid);
        }).then((resJson) => {
            let jwt = resJson ? resJson.jwt : '';
            if (!jwt) {
                this.signOut();
                window.location.replace(ROUTES.SIGNIN);
                return;
            }
            this.jwt = jwt;

            let waittingTime = Math.max(0, this.payload.exp - Date.now() - PREPARE_TIME);
            return this._keepToken(waittingTime);
        });
    };
}

export default new AuthenticationHelper();
