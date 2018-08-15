import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateKeywordreplies, removeKeywordreply } from '../../redux/actions/mainStore/appsKeywordreplies';

class AppsKeywordreplies extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-keywordreplies/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsKeywordreplies>}
     */
    find(appId) {
        let appsKeywordreplies = mainStore.getState().appsKeywordreplies;
        if (Object.keys(appsKeywordreplies).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsKeywordreplies
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateKeywordreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {Chatshier.Model.Keywordreply} keywordreply
     * @returns {Promise<Chatshier.Response.AppsKeywordreplies>}
     */
    insert(appId, keywordreply) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(keywordreply)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateKeywordreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @param {Chatshier.Model.Autoreply} keywordreply
     * @returns {Promise<Chatshier.Response.AppsKeywordreplies>}
     */
    update(appId, keywordreplyId, keywordreply) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/keywordreplies/' + keywordreplyId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(keywordreply)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateKeywordreplies(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @returns {Promise<Chatshier.Response.AppsKeywordreplies>}
     */
    delete(appId, keywordreplyId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/keywordreplies/' + keywordreplyId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeKeywordreply(appId, keywordreplyId));
            return resJson;
        });
    };
}

export default AppsKeywordreplies;
