import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroups, deleteGroup } from '../../redux/actions/groups';

/**
 * 宣告專門處理群組相關的 API 類別
 */
class Groups extends Core {
    constructor() {
        super();

        this.urlPrefix = this.prefixUrl + 'groups/';
    }

    /**
     * 取得使用者所屬的所有群組
     *
     * @param {string} userId - 使用者的 firebase ID
     * @returns {GroupsResponse}
     */
    findAll(userId) {
        let groups = mainStore.getState().groups;
        if (Object.keys(groups).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: groups
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroups(resJson.data));
            return resJson;
        });
    };

    /**
     * 創建一個新的群組
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {Chatshier.Group} group - 新增的群組資料
     * @returns {AppsTicketsResponse}
     */
    insert(userId, group) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(group)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroups(resJson.data));
            return resJson;
        });
    };

    /**
     * 更新指定群組資料
     *
     * @param {string} groupId - 群組 ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {Chatshier.Group} group - 欲更新的群組資料
     * @returns {GroupsResponse}
     */
    update(groupId, userId, group) {
        let destUrl = this.urlPrefix + 'groups/' + groupId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(group)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroups(resJson.data));
            return resJson;
        });
    };

    /**
     * 刪除指定群組
     *
     * @param {string} groupId - 群組 ID
     * @param {string} userId - 使用者的 firebase ID
     */
    delete(groupId, userId) {
        let destUrl = this.urlPrefix + 'groups/' + groupId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteGroup(groupId));
            return resJson;
        });
    };
}

export default Groups;
