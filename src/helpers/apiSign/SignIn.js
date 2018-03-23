import Core from './Core';
import { reqHeaders } from './index';

class SignIn extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'signin';
    }
    do(user) {
        let destUrl = this.urlPrefix;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default SignIn;