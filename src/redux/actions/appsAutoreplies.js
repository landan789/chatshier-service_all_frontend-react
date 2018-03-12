export const UPDATE_AUTOREPLIES = 'UPDATE_AUTOREPLIES';
export const DELETE_AUTOREPLY = 'DELETE_AUTOREPLY';

/**
 * @param {AppsAutoreplies} appsAutoreplies
 */
export const updateAutoreplies = (appsAutoreplies) => {
    return { type: UPDATE_AUTOREPLIES, appsAutoreplies };
};

/**
 * @param {string} appId
 * @param {string} autoreplyId
 */
export const deleteAutoreply = (appId, autoreplyId) => {
    return { type: DELETE_AUTOREPLY, appId, autoreplyId };
};
