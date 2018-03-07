import Core from './Core';
import { reqHeaders } from './index';

/**
 * 宣告專門處理 Messager 相關的 API 類別
 */
class AppsMessagers extends Core {
    constructor() {
        super();

        this.urlPrefix = this.prefixUrl + 'apps-messagers/';
    }

    /**
     * 取得使用者所有在 Chatshier 內設定的 App 內的所有 Messagers
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
     * 取得指定 AppId 內使用者的所有 Messagers
     *
     * @param {string} appId - 目標 messager 的 App ID
     * @param {string} msgerId - 目標 messager ID
     * @param {string} userId - 使用者的 firebase ID
     */
    getOne(appId, msgerId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + msgerId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 更新指定 AppId 內的 messager 資料
     *
     * @param {string} appId - 目標 messager 的 App ID
     * @param {string} msgerId - 目標 messager ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} msgerData - 欲更新的 messager 資料
     */
    update(appId, msgerId, userId, msgerData) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + msgerId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(msgerData)
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default AppsMessagers;
