import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateAutoreplies, removeAutoreply } from '../../redux/actions/mainStore/appsAutoreplies';

class AppsAutoreplies extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-autoreplies/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsAutoreplies>}
     */
    find(appId) {
        let appsAutoreplies = mainStore.getState().appsAutoreplies;
        if (Object.keys(appsAutoreplies).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsAutoreplies
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateAutoreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {Chatshier.Model.Autoreply} autoreply
     * @returns {Promise<Chatshier.Response.AppsAutoreplies>}
     */
    insert(appId, autoreply) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(autoreply)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateAutoreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} autoreplyId
     * @param {Chatshier.Model.Autoreply} autoreply
     * @returns {Promise<Chatshier.Response.AppsAutoreplies>}
     */
    update(appId, autoreplyId, autoreply) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/autoreplies/' + autoreplyId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(autoreply)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateAutoreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} autoreplyId
     */
    delete(appId, autoreplyId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/autoreplies/' + autoreplyId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeAutoreply(appId, autoreplyId));
            return resJson;
        });
    };
}

export default AppsAutoreplies;
