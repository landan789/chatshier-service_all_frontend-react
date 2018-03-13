import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateKeywordreplies, deleteKeywordreply } from '../../redux/actions/appsKeywordreplies';

class AppsKeywordreplies extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-keywordreplies/';
    }

    /**
     * @param {string|null} appId
     * @param {string} userId
     * @returns {Promise<AppsKeywordrepliesResponse>}
     */
    findAll(appId, userId) {
        let appsKeywordreplies = mainStore.getState().appsKeywordreplies;
        if (Object.keys(appsKeywordreplies).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsKeywordreplies
            });
        }

        let destUrl = this.urlPrefix + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Keywordreply} keywordreply
     * @returns {Promise<AppsKeywordrepliesResponse>}
     */
    insert(appId, userId, keywordreply) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Autoreply} keywordreply
     * @returns {Promise<AppsKeywordrepliesResponse>}
     */
    update(appId, keywordreplyId, userId, keywordreply) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/keywordreplies/' + keywordreplyId + '/users/' + userId;
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
     * @param {string} userId
     */
    delete(appId, keywordreplyId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/keywordreplies/' + keywordreplyId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteKeywordreply(appId, keywordreplyId));
            return resJson;
        });
    };
}

export default AppsKeywordreplies;
