import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateComposes, deleteCompose } from '../../redux/actions/mainStore/appsComposes';

class AppsComposes extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-composes/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsComposes>}
     */
    find(appId) {
        let appsComposes = mainStore.getState().appsComposes;
        if (Object.keys(appsComposes).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsComposes
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateComposes(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {Chatshier.Compose} compose
     * @returns {Promise<Chatshier.Response.AppsComposes>}
     */
    insert(appId, compose) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(compose)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateComposes(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} composeId
     * @param {Chatshier.Compose} compose
     * @returns {Promise<Chatshier.Response.Appscomposes>}
     */
    update(appId, composeId, compose) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/composes/' + composeId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(compose)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateComposes(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} composeId
     */
    delete(appId, composeId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/composes/' + composeId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteCompose(appId, composeId));
            return resJson;
        });
    };
}

export default AppsComposes;
