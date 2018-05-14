export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const DELETE_GROUP = 'DELETE_GROUP';

/**
 * @param {Chatshier.Groups} groups
 */
export const updateGroups = (groups) => {
    return { type: UPDATE_GROUPS, groups };
};

/**
 * @param {string} groupId
 */
export const deleteGroup = (groupId) => {
    return { type: DELETE_GROUP, groupId };
};
