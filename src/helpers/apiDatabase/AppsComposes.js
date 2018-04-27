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
     * @param {string|null} appId
     * @param {string} userId
     * @returns {Promise<AppsComposesResponse>}
     */
    find(appId, userId) {
        let appsComposes = mainStore.getState().appsComposes;
        if (Object.keys(appsComposes).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsComposes
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Compose} compose
     * @returns {Promise<AppsComposesResponse>}
     */
    insert(appId, userId, composes, usingRecursive) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;

        let reqInit;
        if (composes instanceof Array) {
            reqInit = composes.map(function(compose) {
                return {
                    method: 'POST',
                    headers: reqHeaders,
                    body: JSON.stringify(compose)
                };
            });
        } else {
            reqInit = {
                method: 'POST',
                headers: reqHeaders,
                body: JSON.stringify(composes)
            };
        }

        return this.sendRequest(destUrl, reqInit, usingRecursive).then((resJson) => {
            mainStore.dispatch(updateComposes(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} composeId
     * @param {string} userId
     * @param {Chatshier.Compose} compose
     * @returns {Promise<AppscomposesResponse>}
     */
    update(appId, composeId, userId, compose) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/composes/' + composeId + '/users/' + userId;
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
     * @param {string} userId
     */
    delete(appId, composeId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/composes/' + composeId + '/users/' + userId;
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
