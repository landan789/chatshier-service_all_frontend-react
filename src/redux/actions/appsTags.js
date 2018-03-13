export const UPDATE_TAGS = 'UPDATE_TAGS';
export const DELETE_TAG = 'DELETE_TAG';

/**
 * @param {Chatshier.AppsTags} appsTags
 */
export const updateTags = (appsTags) => {
    return { type: UPDATE_TAGS, appsTags };
};

/**
 * @param {string} appId
 * @param {string} tagId
 */
export const deleteTag = (appId, tagId) => {
    return { type: DELETE_TAG, appId, tagId };
};
