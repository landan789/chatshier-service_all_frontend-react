import Core from './Core';
import { reqHeaders } from './index';

class SignOut extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'signout/';
    }

    do() {
        let destUrl = this.apiEndPoint;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default SignOut;
