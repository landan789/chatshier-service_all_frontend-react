import Core from './Core';
import { reqHeaders } from './index';

/**
 * 宣告專門處理待辦事項相關的 API 類別
 */
class AppsTickets extends Core {
    constructor() {
        super();

        this.urlPrefix = this.prefixUrl + 'apps-tickets/';
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
     * 取得使用者所有設定待辦事項
     *
     * @param {string|null} appId - 目標待辦事項的 App ID
     * @param {string} userId - 使用者的 firebase ID
     */
    findAll(appId, userId) {
        let destUrl = this.urlPrefix + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 新增一筆待辦事項資料
     *
     * @param {string} appId - 目標待辦事項的 App ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} ticket - 欲新增的待辦事項資料
     */
    insert(appId, userId, ticket) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(ticket)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 更新目標待辦事項資料
     *
     * @param {string} appId - 目標待辦事項的 App ID
     * @param {string} ticketId - 目標待辦事項的 ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} ticket - 已編輯後欲更新的待辦事項資料
     */
    update(appId, ticketId, userId, ticket) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(ticket)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 刪除一筆待辦事項資料
     *
     * @param {string} appId - 目標待辦事項的 App ID
     * @param {string} ticketId - 目標待辦事項的 ID
     * @param {string} userId - 使用者的 firebase ID
     */
    remove(appId, ticketId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default AppsTickets;
