export const UPDATE_MEMBERS = 'UPDATE_GROUPS_MEMBERS';
export const REMOVE_MEMBER = 'REMOVE_GROUP_MEMBER';

/**
 * @param {Chatshier.Model.GroupsMembers} groupsMembers
 */
export const updateGroupsMembers = (groupsMembers) => {
    return { type: UPDATE_MEMBERS, groupsMembers };
};

/**
 * @param {string} groupId
 * @param {string} memberId
 */
export const removeGroupMember = (groupId, memberId) => {
    return { type: REMOVE_MEMBER, groupId, memberId };
};
