export const UPDATE_KEYWORDREPLIES = 'UPDATE_KEYWORDREPLIES';
export const REMOVE_KEYWORDREPLY = 'REMOVE_KEYWORDREPLY';
export const REMOVE_ALL_KEYWORDREPLIES = 'REMOVE_ALL_KEYWORDREPLIES';

/**
 * @param {Chatshier.Model.AppsKeywordreplies} appsKeywordreplies
 */
export const updateKeywordreplies = (appsKeywordreplies) => {
    return { type: UPDATE_KEYWORDREPLIES, appsKeywordreplies };
};

/**
 * @param {string} appId
 * @param {string} keywordreplyId
 */
export const removeKeywordreply = (appId, keywordreplyId) => {
    return { type: REMOVE_ALL_KEYWORDREPLIES, appId, keywordreplyId };
};

/**
 * @param {string} appId
 */
export const removeAllKeywordreplies = (appId) => {
    return { type: REMOVE_ALL_KEYWORDREPLIES, appId };
};
