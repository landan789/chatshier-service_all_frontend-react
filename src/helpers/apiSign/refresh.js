import Core from './Core';
import { reqHeaders } from './index';

class Refresh extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'refresh/';
    }

    do() {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default Refresh;
