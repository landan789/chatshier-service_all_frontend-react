import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateReceptionists, deleteReceptionist } from '../../redux/actions/mainStore/appsReceptionists';

class AppsReceptionists extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-receptionists/';
    }

    /**
     * @param {string} [appId]
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    find(appId, userId) {
        let appsReceptionists = mainStore.getState().appsReceptionists;
        if (Object.keys(appsReceptionists).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsReceptionists
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateReceptionists(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Models.Receptionist} receptionist
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    insert(appId, userId, receptionist) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(receptionist)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateReceptionists(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} receptionistId
     * @param {string} userId
     * @param {Chatshier.Models.Receptionist} receptionist
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    update(appId, receptionistId, userId, category) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/receptionists/' + receptionistId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(category)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateReceptionists(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} receptionistId
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    delete(appId, receptionistId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/receptionists/' + receptionistId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteReceptionist(appId, receptionistId));
            return resJson;
        });
    };
}

export default AppsReceptionists;
