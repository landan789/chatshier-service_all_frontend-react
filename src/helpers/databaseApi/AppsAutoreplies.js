import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateAutoreplies, deleteAutoreply } from '../../redux/actions/appsAutoreplies';

class AppsAutoreplies extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-autoreplies/';
    }

    /**
     * @param {string|null} appId
     * @param {string} userId
     * @returns {Promise<AppsAutorepliesResponse>}
     */
    findAll(appId, userId) {
        let appsAutoreplies = mainStore.getState().appsAutoreplies;
        if (Object.keys(appsAutoreplies).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsAutoreplies
            });
        }

        let destUrl = this.urlPrefix + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Autoreply} autoreply
     * @returns {Promise<AppsAutorepliesResponse>}
     */
    insert(appId, userId, autoreply) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Autoreply} autoreply
     * @returns {Promise<AppsAutorepliesResponse>}
     */
    update(appId, autoreplyId, userId, autoreply) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/autoreplies/' + autoreplyId + '/users/' + userId;
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
     * @param {string} userId
     */
    delete(appId, autoreplyId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/autoreplies/' + autoreplyId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteAutoreply(appId, autoreplyId));
            return resJson;
        });
    };
}

export default AppsAutoreplies;
