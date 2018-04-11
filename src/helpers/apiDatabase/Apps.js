import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateApps, deleteApp } from '../../redux/actions/apps';

class Apps extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps/';
        this.enums = Object.freeze({
            type: {
                SYSTEM: 'SYSTEM',
                CHATSHIER: 'CHATSHIER',
                LINE: 'LINE',
                FACEBOOK: 'FACEBOOK'
            }
        });
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsResponse>}
     */
    find(userId) {
        let apps = mainStore.getState().apps;
        if (Object.keys(apps).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: apps
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @returns {Promise<AppsResponse>}
     */
    findOne(appId, userId) {
        let apps = mainStore.getState().apps;
        if (apps[appId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: { [appId]: apps[appId] }
            });
        }

        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @param {Chatshier.App} app
     * @returns {Promise<AppsResponse>}
     */
    insert(userId, app) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.App} app
     * @returns {Promise<AppsResponse>}
     */
    update(appId, userId, app) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     */
    delete(appId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteApp(appId));
            return resJson;
        });
    };
}

export default Apps;
