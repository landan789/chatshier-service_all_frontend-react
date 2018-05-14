import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateFields, deleteField } from '../../redux/actions/mainStore/appsFields';

class AppsFields extends Core {
    static TYPES = Object.freeze({
        SYSTEM: 'SYSTEM',
        DEFAULT: 'DEFAULT',
        CUSTOM: 'CUSTOM'
    })

    static SETS_TYPES = Object.freeze({
        TEXT: 'TEXT',
        NUMBER: 'NUMBER',
        DATE: 'DATE',
        SELECT: 'SELECT',
        MULTI_SELECT: 'MULTI_SELECT',
        CHECKBOX: 'CHECKBOX'
    })

    constructor() {
        super();
        this.apiEndPoint += 'apps-fields/';
        this.TYPES = AppsFields.TYPES;
        this.SETS_TYPES = AppsFields.SETS_TYPES;
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

        let destUrl = this.apiEndPoint + 'users/' + userId;
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
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
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
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/fields/' + fieldId + '/users/' + userId;
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
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/fields/' + fieldId + '/users/' + userId;
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
