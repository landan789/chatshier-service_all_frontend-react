import firebase from 'firebase';
import jwtDecode from 'jwt-decode';

import { setJWT } from './databaseApi/index';
import firebaseConfig from '../config/firebase';
import cookieHelper, { CHSR_COOKIE } from './cookie';

class AuthenticationHelper {
    constructor() {
        /** @type { firebase.app.App } */
        this.app = null;

        /** @type { firebase.auth.Auth } */
        this.auth = null;

        /** @type { firebase.Unsubscribe } */
        this.unsubscribeAuth = null;

        this.ready = new Promise((resolve) => {
            this._readyResolve = resolve;
        });
        this._refreshTimer = null;
    }

    get userId() {
        let jwt = window.localStorage.setItem('jwt') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5dGhmbHIuc2VydmljZUBnbWFpbC5jb20iLCJpc3MiOiI5dGhmbHIuc2VydmljZUBnbWFpbC5jb20iLCJhZHUiOiJjaGF0c2hpZXIuY29tIiwiZXhwIjoxNTIxNDcwNjcwNDY3LCJpYXQiOjE1MjE0NjcwNzA0NjcsInVpZCI6IjVhYWY4MjViOWNiNzlmMWRiY2Q2YzIxYSJ9.fx_z1orNvuMAEtNHyVmpH_uGWST6KON3nY0ZTwSSCPo';
        let uid = '';
        if (jwt) {
            let payload = jwtDecode(jwt);
            uid = payload.uid || '';
        }
        return uid;
    }
    /**
     * 每 55 分鐘自動更新一次 firebase token
     */
    _keepTokenRefresh() {

    };

    /**
     * 初始化 firebase app 應用
     */
    init() {
        if (this.app) {
            return this.app;
        }

        this.app = firebase.initializeApp(window.config || firebaseConfig);
        this.auth = this.app.auth();

        this.unsubscribeAuth && this.unsubscribeAuth();
        this.unsubscribeAuth = this.auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                return this.auth.currentUser.getIdToken(true).then((jwt) => {
                    window.localStorage.setItem('jwt', jwt);
                    setJWT(jwt);
                    this._readyResolve && this._readyResolve();
                    this._readyResolve = void 0;
                    return this._keepTokenRefresh();
                });
            }

            this._refreshTimer && window.clearTimeout(this._refreshTimer);
            this._readyResolve && this._readyResolve();
            this._refreshTimer = this._readyResolve = void 0;
        });
        return this.app;
    }

    /**
     * 清空登入使用的 cookie 及 localStorage 項目，執行 firebase auth 登出
     */
    signOut() {
        return this.ready.then(() => {
            cookieHelper.deleteCookie(CHSR_COOKIE.USER_NAME);
            cookieHelper.deleteCookie(CHSR_COOKIE.USER_EMAIL);
            window.localStorage.removeItem('jwt');
            return this.auth.signOut();
        });
    }
}

export default new AuthenticationHelper();
