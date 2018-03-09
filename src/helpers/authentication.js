import firebase from 'firebase';

import mainStore from '../redux/mainStore';

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

    _keepTokenRefresh() {
        // 每 55 分鐘更新一次 firebase token
        return new Promise((resolve) => {
            this._refreshTimer && window.clearTimeout(this._refreshTimer);
            this._refreshTimer = window.setTimeout(resolve, 55 * 60 * 1000);
        }).then(() => {
            if (!cookieHelper.hasSignedin()) {
                return;
            }
            return this.auth.currentUser.getIdToken(true);
        }).then((jwt) => {
            if (!jwt) {
                return;
            }
            window.localStorage.setItem('jwt', jwt);
            setJWT(jwt);
            return this._keepTokenRefresh();
        });
    };

    init() {
        this.app = firebase.initializeApp(window.config || firebaseConfig);
        this.auth = this.app.auth();

        this.unsubscribeAuth && this.unsubscribeAuth();
        this.unsubscribeAuth = this.auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                this._keepTokenRefresh();
            } else {
                this._refreshTimer && window.clearTimeout(this._refreshTimer);
            }
        });
        this._readyResolve();
        return this.app;
    }

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
