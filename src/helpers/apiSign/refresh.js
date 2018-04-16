import Core from './Core';
import { reqHeaders } from './index';

class Refresh extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'refresh';
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
export default Refresh;