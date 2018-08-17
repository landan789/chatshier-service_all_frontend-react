export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const REMOVE_GROUP = 'REMOVE_GROUP';

/**
 * @param {Chatshier.Model.Groups} groups
 */
export const updateGroups = (groups) => {
    return { type: UPDATE_GROUPS, groups };
};

/**
 * @param {string} groupId
 */
export const removeGroup = (groupId) => {
    return { type: REMOVE_GROUP, groupId };
};
