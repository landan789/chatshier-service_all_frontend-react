export const UPDATE_GROUPS_MEMBERS = 'UPDATE_GROUPS_MEMBERS';
export const DELETE_GROUP_MEMBER = 'DELETE_GROUP_MEMBER';

/**
 * @param {GroupsMembers} groupsMembers
 */
export const updateGroupsMembers = (groupsMembers) => {
    return { type: UPDATE_GROUPS_MEMBERS, groupsMembers };
};

/**
 * @param {string} groupId
 * @param {string} memberId
 */
export const deleteGroupMember = (groupId, memberId) => {
    return { type: DELETE_GROUP_MEMBER, groupId, memberId };
};
