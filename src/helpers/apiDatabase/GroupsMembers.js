import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateGroupsMembers, deleteGroupMember } from '../../redux/actions/mainStore/groupsMembers';

class GroupsMembers extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'groups-members/';
        this.enums = Object.freeze({
            type: {
                OWNER: 'OWNER',
                ADMIN: 'ADMIN',
                WRITE: 'WRITE',
                READ: 'READ'
            }
        });
    }

    /**
     * @param {string} userId
     * @returns {Promise<GroupsMembersResponse>}
     */
    find(userId) {
        let groupsMembers = mainStore.getState().groupsMembers;
        if (Object.keys(groupsMembers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: groupsMembers
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.GroupMember} groupMember
     * @returns {Promise<GroupsMembersResponse>}
     */
    insert(groupId, userId, groupMember) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.GroupMember} groupMember
     * @returns {Promise<GroupsMembersResponse>}
     */
    update(groupId, memberId, userId, groupMember) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/members/' + memberId + '/users/' + userId;
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
     * @param {string} userId
     */
    delete(groupId, memberId, userId) {
        let destUrl = this.apiEndPoint + 'groups/' + groupId + '/members/' + memberId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteGroupMember(groupId, memberId));
            return resJson;
        });
    };
}

export default GroupsMembers;
