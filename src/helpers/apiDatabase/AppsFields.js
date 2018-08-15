import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateFields, removeField } from '../../redux/actions/mainStore/appsFields';

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
     * @returns {Promise<Chatshier.Response.AppsFields>}
     */
    find() {
        let appsFields = mainStore.getState().appsFields;
        if (Object.keys(appsFields).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsFields
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
     * @param {Chatshier.Field} field
     * @returns {Promise<Chatshier.Response.AppsFields>}
     */
    insert(appId, field) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
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
     * @param {Chatshier.Field} field
     * @returns {Promise<Chatshier.Response.AppsFields>}
     */
    update(appId, fieldId, field) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/fields/' + fieldId + '/users/' + this.userId;
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
     */
    delete(appId, fieldId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/fields/' + fieldId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeField(appId, fieldId));
            return resJson;
        });
    };
}

export default AppsFields;
