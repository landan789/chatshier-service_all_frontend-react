import Core from './Core';
import { reqHeaders } from './index';

class ResetPassword extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'reset-password/';
    }

    /**
     * @param {{ email: string, recaptchaResponse: string }} user
     */
    do(user) {
        let destUrl = this.apiEndPoint;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default ResetPassword;
