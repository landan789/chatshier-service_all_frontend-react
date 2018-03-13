import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroups, deleteGroup } from '../../redux/actions/groups';

class Groups extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'groups/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<GroupsResponse>}
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
     * @param {string} userId
     * @param {Chatshier.Group} group
     * @returns {Promise<GroupsResponse>}
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
     * @param {string} groupId
     * @param {string} userId
     * @param {Chatshier.Group} group
     * @returns {Promise<GroupsResponse>}
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
     * @param {string} groupId
     * @param {string} userId
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
