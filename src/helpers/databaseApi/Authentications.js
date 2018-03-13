import Core from './Core';
import { reqHeaders } from './index';

class Authentications extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'authentications/';
    }

    /**
     * @param {string} userId
     * @param {string} [email]
     * @returns {Promise<AuthenticationsResponse>}
     */
    findUsers(userId, email) {
        let destUrl = this.urlPrefix + 'users/' + userId + (email ? ('?email=' + email) : '');
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {string} userId
     * @param {string} [email]
     * @returns {Promise<AuthenticationsResponse>}
     */
    searchUsers(userId, email) {
        let destUrl = this.urlPrefix + 'users/' + userId + '?' + (email ? ('email=' + email + '&') : '') + 'fuzzy=1';
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default Authentications;
