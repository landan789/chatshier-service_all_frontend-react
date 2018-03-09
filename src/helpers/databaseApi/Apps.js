import Core from './Core';
import { reqHeaders } from './index';

/**
 * 宣告專門處理 Chatshier App 相關的 API 類別
 */
class Apps extends Core {
    constructor() {
        super();

        this.urlPrefix = this.prefixUrl + 'apps/';
        this.enums = Object.freeze({
            type: {
                SYSTEM: 'SYSTEM',
                CHATSHIER: 'CHATSHIER',
                LINE: 'LINE',
                FACEBOOK: 'FACEBOOK'
            }
        });
    }

    /**
     * 取得使用者所有在 Chatshier 內設定的 App
     *
     * @param {string} userId - 使用者的 firebase ID
     */
    findAll(userId) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 取得指定的使用者在 Chatshier 內設定的 App
     *
     * @param {string} userId - 使用者的 firebase ID
     */
    getOne(appId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 新增 Chatshier App
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} postAppData - 新增的 Chatshier App 資料
     */
    insert(userId, postAppData) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(postAppData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 更新指定的 Chatshier App
     *
     * @param {string} appId - 指定的 AppId
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} putAppData - 新增的 Chatshier App 資料
     */
    update(appId, userId, putAppData) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(putAppData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 刪除指定的 Chatshier App
     *
     * @param {string} appId - 指定的 AppId
     * @param {string} userId - 使用者的 firebase ID
     */
    remove(appId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default Apps;
