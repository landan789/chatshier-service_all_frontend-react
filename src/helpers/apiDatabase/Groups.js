import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroups, deleteGroup } from '../../redux/actions/mainStore/groups';

class Groups extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'groups/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    find(userId) {
        let groups = mainStore.getState().groups;
        if (Object.keys(groups).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: groups
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Models.Group} group
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    insert(userId, group) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} groupId
     * @param {string} userId
     * @param {Chatshier.Models.Group} group
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    update(groupId, userId, group) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + userId;
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
     * @param {string} groupId
     * @param {string} userId
     */
    delete(groupId, userId) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + userId;
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
