export const UPDATE_MESSAGERS = 'UPDATE_MESSAGERS';

/**
 * @param {Chatshier.AppsMessagers} appsMessagers
 */
export const updateMessagers = (appsMessagers) => {
    return { type: UPDATE_MESSAGERS, appsMessagers };
};
