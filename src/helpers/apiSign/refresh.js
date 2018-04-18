import Core from './Core';
import { reqHeaders } from './index';

class Refresh extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'refresh/';
    }

    /**
     * @param {string} userId
     */
    do(userId) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default Refresh;
