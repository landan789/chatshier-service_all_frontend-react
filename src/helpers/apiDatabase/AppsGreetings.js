import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGreetings, deleteGreeting } from '../../redux/actions/mainStore/appsGreetings';

class AppsGreetings extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-greetings/';
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

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
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
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
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
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/greetings/' + greetingId + '/users/' + userId;
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
