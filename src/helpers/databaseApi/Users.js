import Core from './Core';
import { reqHeaders } from './index';

/**
 * 宣告專門處理 Chatshier User 相關的 API 類別
 */
class Users extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'users/';
    }

    /**
     * 取得使用者的 User 資料
     *
     * @param {string} userId - 使用者的 firebase ID
     */
    findOne(userId) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            methods: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 新增 Chatshier User
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} postUserData - 新增的 Chatshier User 資料
     */
    insert(userId, postUserData) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(postUserData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 更新 Chatshier User
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {any} putUserData - 更新的 Chatshier User 資料
     */
    update(userId, putUserData) {
        let destUrl = this.prefixUrl + 'users/' + userId;
        let reqInit = {
            medthod: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(putUserData)
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default Users;
