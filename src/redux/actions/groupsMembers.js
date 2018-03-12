export const UPDATE_MEMBERS = 'UPDATE_GROUPS_MEMBERS';
export const DELETE_MEMBER = 'DELETE_GROUP_MEMBER';

/**
 * @param {GroupsMembers} groupsMembers
 */
export const updateGroupsMembers = (groupsMembers) => {
    return { type: UPDATE_MEMBERS, groupsMembers };
};

/**
 * @param {string} groupId
 * @param {string} memberId
 */
export const deleteGroupMember = (groupId, memberId) => {
    return { type: DELETE_MEMBER, groupId, memberId };
};
