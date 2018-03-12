import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateApps, deleteApp } from '../../redux/actions/apps';

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
     * @returns {AppsResponse}
     */
    findAll(userId) {
        let apps = mainStore.getState().apps;
        if (Object.keys(apps).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: apps
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * 取得指定的使用者在 Chatshier 內設定的 App
     *
     * @param {string} userId - 使用者的 firebase ID
     * @returns {AppsResponse}
     */
    findOne(appId, userId) {
        let apps = mainStore.getState().apps;
        if (apps[appId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: { [appId]: apps[appId] }
            });
        }

        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * 新增 Chatshier App
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {Chatshier.App} app - 新增的 Chatshier App 資料
     * @returns {AppsResponse}
     */
    insert(userId, app) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * 更新指定的 Chatshier App
     *
     * @param {string} appId - 指定的 AppId
     * @param {string} userId - 使用者的 firebase ID
     * @param {Chatshier.App} app - 新增的 Chatshier App 資料
     * @returns {AppsResponse}
     */
    update(appId, userId, app) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * 刪除指定的 Chatshier App
     *
     * @param {string} appId - 指定的 AppId
     * @param {string} userId - 使用者的 firebase ID
     */
    delete(appId, userId) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteApp(appId));
            return resJson;
        });
    };
}

export default Apps;
