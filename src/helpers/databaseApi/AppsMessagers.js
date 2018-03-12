import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateMessagers } from '../../redux/actions/appsMessagers';

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
     * @returns {AppsMessagersResponse}
     */
    findAll(userId) {
        let appsMessagers = mainStore.getState().appsMessagers;
        if (Object.keys(appsMessagers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsMessagers
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };

    /**
     * 取得指定 AppId 內使用者的所有 Messagers
     *
     * @param {string} appId - 目標 messager 的 App ID
     * @param {string} messgerId - 目標 messager ID
     * @param {string} userId - 使用者的 firebase ID
     * @returns {AppsMessagersResponse}
     */
    findOne(appId, messgerId, userId) {
        let appsMessagers = mainStore.getState().appsMessagers;
        if (appsMessagers[appId] && appsMessagers[appId].messagers[messgerId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsMessagers
            });
        }

        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + messgerId + '/users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };

    /**
     * 更新指定 AppId 內的 messager 資料
     *
     * @param {string} appId - 目標 messager 的 App ID
     * @param {string} msgerId - 目標 messager ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {Chatshier.Messager} messager - 欲更新的 messager 資料
     * @returns {AppsMessagersResponse}
     */
    update(appId, msgerId, userId, messager) {
        let destUrl = this.urlPrefix + 'apps/' + appId + '/messager/' + msgerId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(messager)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessagers(resJson.data));
            return resJson;
        });
    };
}

export default AppsMessagers;
