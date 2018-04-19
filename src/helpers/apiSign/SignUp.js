import Core from './Core';
import { reqHeaders } from './index';

class SignUp extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'signup/';
    }

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
export default SignUp;
