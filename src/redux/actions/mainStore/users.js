export const UPDATE_USERS = 'UPDATE_USERS';

/**
 * @param {Chatshier.Model.Users} users
 */
export const updateUsers = (users) => {
    return { type: UPDATE_USERS, users };
};
