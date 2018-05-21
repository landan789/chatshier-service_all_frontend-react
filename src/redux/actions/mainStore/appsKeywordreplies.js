export const UPDATE_KEYWORDREPLIES = 'UPDATE_KEYWORDREPLIES';
export const DELETE_KEYWORDREPLY = 'DELETE_KEYWORDREPLY';
export const DELETE_ALL_KEYWORDREPLIES = 'DELETE_ALL_KEYWORDREPLIES';

/**
 * @param {Chatshier.AppsKeywordreplies} appsKeywordreplies
 */
export const updateKeywordreplies = (appsKeywordreplies) => {
    return { type: UPDATE_KEYWORDREPLIES, appsKeywordreplies };
};

/**
 * @param {string} appId
 * @param {string} keywordreplyId
 */
export const deleteKeywordreply = (appId, keywordreplyId) => {
    return { type: DELETE_ALL_KEYWORDREPLIES, appId, keywordreplyId };
};

/**
 * @param {string} appId
 */
export const deleteAllKeywordreplies = (appId) => {
    return { type: DELETE_ALL_KEYWORDREPLIES, appId };
};
