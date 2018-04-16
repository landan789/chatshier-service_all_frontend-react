import Core from './Core';
import { reqHeaders } from './index';

class SignOut extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'signout';
    }
    do(user) {
        let destUrl = this.urlPrefix;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default SignOut;