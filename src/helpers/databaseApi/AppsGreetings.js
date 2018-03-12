import Core from './Core';
import { reqHeaders } from './index';

class AppsGreetings extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-greetings/';
    }

    findAll(appId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/';
        let reqInit = {
            methods: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    findOne(appId, greetingId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/' + greetingId;
        let reqInit = {
            methods: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    insert(appId, text) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/';
        let reqInit = {
            methods: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(text)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    update(appId, greetingId, text) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/' + greetingId;
        let reqInit = {
            methods: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(text)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    delete(appId, greetingId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/' + greetingId;
        let reqInit = {
            methods: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default AppsGreetings;
