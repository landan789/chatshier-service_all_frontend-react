import jwtDecode from 'jwt-decode';
import cookieHelper, { CHSR_COOKIE } from './cookie';

class AuthenticationHelper {
    constructor() {
        let jwt = window.localStorage.getItem('jwt');
        this.payload = jwt ? jwtDecode(jwt) : {};
    }

    get userId() {
        return this.payload.uid || '';
    }

    // /**
    //  * 每 55 分鐘自動更新一次 firebase token
    //  */
    // _keepTokenRefresh() {
    //     return new Promise((resolve) => {
    //         this._refreshTimer && window.clearTimeout(this._refreshTimer);
    //         this._refreshTimer = window.setTimeout(resolve, 55 * 60 * 1000);
    //     }).then(() => {
    //         if (!cookieHelper.hasSignedin()) {
    //             return;
    //         }
    //         return this.auth.currentUser.getIdToken(true);
    //     }).then((jwt) => {
    //         if (!jwt) {
    //             return;
    //         }
    //         window.localStorage.setItem('jwt', jwt);
    //         setJWT(jwt);
    //         return this._keepTokenRefresh();
    //     });
    // };

    /**
     * 清空登入使用的 cookie 及 localStorage 項目，執行 firebase auth 登出
     */
    signOut() {
        cookieHelper.deleteCookie(CHSR_COOKIE.USER_NAME);
        cookieHelper.deleteCookie(CHSR_COOKIE.USER_EMAIL);
        window.localStorage.removeItem('jwt');
    }
}

export default new AuthenticationHelper();
