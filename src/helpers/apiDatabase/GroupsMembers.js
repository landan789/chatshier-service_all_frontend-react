import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroupsMembers, removeGroupMember } from '../../redux/actions/mainStore/groupsMembers';

class GroupsMembers extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'groups-members/';
        this.TYPES = Object.freeze({
            OWNER: 'OWNER',
            ADMIN: 'ADMIN',
            WRITE: 'WRITE',
            READ: 'READ'
        });
    }

    /**
     * @returns {Promise<Chatshier.Response.GroupsMembers>}
     */
    find() {
        let groupsMembers = mainStore.getState().groupsMembers;
        if (Object.keys(groupsMembers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: groupsMembers
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroupsMembers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} groupId
     * @param {Chatshier.Models.GroupMember} groupMember
     * @returns {Promise<Chatshier.Response.GroupsMembers>}
     */
    insert(groupId, groupMember) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(groupMember)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroupsMembers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} groupId
     * @param {string} memberId
     * @param {Chatshier.Models.GroupMember} groupMember
     * @returns {Promise<Chatshier.Response.GroupsMembers>}
     */
    update(groupId, memberId, groupMember) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/members/' + memberId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(groupMember)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateGroupsMembers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} groupId
     * @param {string} memberId
     */
    remove(groupId, memberId) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/members/' + memberId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeGroupMember(groupId, memberId));
            return resJson;
        });
    };
}

export default GroupsMembers;
