import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroups, removeGroup } from '../../redux/actions/mainStore/groups';

class Groups extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'groups/';
    }

    /**
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    find() {
        let groups = mainStore.getState().groups;
        if (Object.keys(groups).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: groups
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
     * @param {Chatshier.Models.Group} group
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    insert(group) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
     * @param {Chatshier.Models.Group} group
     * @returns {Promise<Chatshier.Response.Groups>}
     */
    update(groupId, group) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + this.userId;
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
     */
    remove(groupId) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeGroup(groupId));
            return resJson;
        });
    };
}

export default Groups;
