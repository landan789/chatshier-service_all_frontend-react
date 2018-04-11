import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGreetings, deleteGreeting } from '../../redux/actions/appsGreetings';

class AppsGreetings extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-greetings/';
    }

    find(appId, userId) {
        let appsGreetings = mainStore.getState().appsGreetings;
        if (Object.keys(appsGreetings).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsGreetings
            });
        }

        let destUrl = this.urlPrefix + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGreetings(resJson.data));
            return resJson;
        });
    };

    insert(appId, userId, greeting) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(greeting)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGreetings(resJson.data));
            return resJson;
        });
    };

    delete(appId, userId, greetingId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/greetings/' + greetingId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteGreeting(appId, greetingId));
            return resJson;
        });
    };
}

export default AppsGreetings;