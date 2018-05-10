import Core from './Core';
import { reqHeaders } from './index';

class ChangePassword extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'change-password/';
    }

    /**
     * @param {string} userId
     * @param {{ password: string, newPassword: string, newPasswordCfm: string }} user
     */
    post(userId, user) {
        let destUrl = this.apiEndPoint;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit);
    }

    /**
     * @param {string} userId
     * @param {{ newPassword: string, newPasswordCfm: string }} user
     * @param {string} jwt - 重置密碼時，臨時配發的短期 token
     */
    put(userId, user, jwt) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
        let _reqHeaders = new Headers();
        _reqHeaders.set('Authorization', jwt);
        _reqHeaders.set('Content-Type', 'application/json');

        let reqInit = {
            method: 'PUT',
            headers: _reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default ChangePassword;
