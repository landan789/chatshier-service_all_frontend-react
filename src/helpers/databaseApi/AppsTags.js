import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateTags, deleteTag } from '../../redux/actions/appsTags';

class AppsTags extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-tags/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsTagsResponse>}
     */
    findAll(userId) {
        let appsTags = mainStore.getState().appsTags;
        if (Object.keys(appsTags).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsTags
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTags(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Tag} tag
     * @returns {Promise<AppsTagsResponse>}
     */
    insert(appId, userId, tag) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(tag)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTags(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @param {string} userId
     * @param {Chatshier.Tag} tag
     * @returns {Promise<AppsTagsResponse>}
     */
    update(appId, tagId, userId, tag) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/tags/' + tagId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(tag)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTags(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @param {string} userId
     */
    delete(appId, tagId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/tags/' + tagId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteTag(appId, tagId));
            return resJson;
        });
    };
}

export default AppsTags;
