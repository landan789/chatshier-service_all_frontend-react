export const UPDATE_AUTOREPLIES = 'UPDATE_AUTOREPLIES';
export const REMOVE_AUTOREPLY = 'REMOVE_AUTOREPLY';
export const REMOVE_ALL_AUTOREPLIES = 'REMOVE_ALL_AUTOREPLIES';

/**
 * @param {Chatshier.Model.AppsAutoreplies} appsAutoreplies
 */
export const updateAutoreplies = (appsAutoreplies) => {
    return { type: UPDATE_AUTOREPLIES, appsAutoreplies };
};

/**
 * @param {string} appId
 * @param {string} autoreplyId
 */
export const removeAutoreply = (appId, autoreplyId) => {
    return { type: REMOVE_AUTOREPLY, appId, autoreplyId };
};

/**
 * @param {string} appId
 */
export const removeAllAutoreplies = (appId) => {
    return { type: REMOVE_ALL_AUTOREPLIES, appId };
};
