export const UPDATE_KEYWORDREPLIES = 'UPDATE_KEYWORDREPLIES';
export const DELETE_KEYWORDREPLY = 'DELETE_KEYWORDREPLY';

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
    return { type: DELETE_KEYWORDREPLY, appId, keywordreplyId };
};
