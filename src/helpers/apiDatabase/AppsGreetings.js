import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGreetings, removeGreeting } from '../../redux/actions/mainStore/appsGreetings';

class AppsGreetings extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-greetings/';
    }

    /**
     * @param {string} appId
     * @returns {Promise<Chatshier.Response.AppsGreetings>}
     */
    find(appId) {
        let appsGreetings = mainStore.getState().appsGreetings;
        if (Object.keys(appsGreetings).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsGreetings
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGreetings(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {Chatshier.Greeting} greeting
     * @returns {Promise<Chatshier.Response.AppsGreetings>}
     */
    insert(appId, greeting) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
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

    /**
     * @param {string} appId
     * @param {string} greetingId
     * @returns {Promise<Chatshier.Response.AppsGreetings>}
     */
    delete(appId, greetingId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/greetings/' + greetingId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeGreeting(appId, greetingId));
            return resJson;
        });
    };
}

export default AppsGreetings;
