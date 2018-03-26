import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateMessagers } from '../../redux/actions/appsMessagers';

class AppsMessagers extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-messagers/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsMessagersResponse>}
     */
    find(userId) {
        let appsMessagers = mainStore.getState().appsMessagers;
        if (Object.keys(appsMessagers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsMessagers
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} messgerId
     * @param {string} userId
     * @returns {Promise<AppsMessagersResponse>}
     */
    findOne(appId, messgerId, userId) {
        let appsMessagers = mainStore.getState().appsMessagers;
        if (appsMessagers[appId] && appsMessagers[appId].messagers[messgerId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsMessagers
            });
        }

        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + messgerId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} msgerId
     * @param {string} userId
     * @param {Chatshier.Messager} messager
     * @returns {Promise<AppsMessagersResponse>}
     */
    update(appId, msgerId, userId, messager) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + msgerId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(messager)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };
}

export default AppsMessagers;
