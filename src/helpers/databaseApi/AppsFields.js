import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateFields, deleteField } from '../../redux/actions/appsFields';

class AppsFields extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-fields/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsFieldsResponse>}
     */
    find(userId) {
        let appsFields = mainStore.getState().appsFields;
        if (Object.keys(appsFields).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsFields
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateFields(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Field} field
     * @returns {Promise<AppsFieldsResponse>}
     */
    insert(appId, userId, field) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(field)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateFields(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @param {string} userId
     * @param {Chatshier.Field} field
     * @returns {Promise<AppsFieldsResponse>}
     */
    update(appId, fieldId, userId, field) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/fields/' + fieldId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(field)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateFields(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} keywordreplyId
     * @param {string} userId
     */
    delete(appId, fieldId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/fields/' + fieldId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteField(appId, fieldId));
            return resJson;
        });
    };
}

export default AppsFields;
