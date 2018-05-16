import Core from './Core';
import { reqHeaders } from './index';

class Richmenus extends Core {
    /**
     * 連結 目標Menu 與 Consumers
     *
     * @param {string} appId - 目標 Menu 的 App ID
     * @param {string} menuId - 目標 Menu 的 ID
     * @param {string} userId
     */
    activateMenu(appId, menuId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/menus/' + menuId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 解除 目標Menu 與 Consumers 的連結
     *
     * @param {string} appId - 目標 Menu的 App ID
     * @param {string} menuId - 目標 Menu的 ID
     * @param {string} userId
     */
    deactivateMenu(appId, menuId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/menus/' + menuId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 刪除一筆在 LINE 或 Wechat server 的 Menu 資料
     *
     * @param {string} appId - 目標Menu的 App ID
     * @param {string} menuId - 目標Menu的 ID
     * @param {string} userId
     */
    deleteMenu(appId, menuId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/menus/' + menuId + '/users/' + userId + '/content/';
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default Richmenus;
