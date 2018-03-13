export const UPDATE_USERS = 'UPDATE_USERS';

/**
 * @param {Chatshier.Users} users
 */
export const updateUsers = (users) => {
    return { type: UPDATE_USERS, users };
};
