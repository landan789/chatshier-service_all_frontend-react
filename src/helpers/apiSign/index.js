import SignIn from './SignIn';
import SignUp from './SignUp';
import SignOut from './SignOut';
import ChangePassword from './ChangePassword';
import ResetPassword from './ResetPassword';
import Refresh from './refresh';

let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

class APISign {
    constructor() {
        this.signIn = new SignIn();
        this.signUp = new SignUp();
        this.changePassword = new ChangePassword();
        this.resetPassword = new ResetPassword();
        this.signOut = new SignOut();
        this.refresh = new Refresh();
    }

    /**
     * 設定 API 驗證身份所需的 JSON Web Token
     *
     * @param {string} jwt
     */
    setJWT(jwt = '') {
        reqHeaders.set('Authorization', jwt);
    }
}

export default new APISign();
export { reqHeaders };
