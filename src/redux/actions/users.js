export const UPDATE_USERS = 'UPDATE_USERS';

/**
 * @param {Users} users
 */
export const updateGroupsMembers = (users) => {
    return { type: UPDATE_USERS, users };
};
