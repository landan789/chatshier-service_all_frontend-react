export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const REMOVE_ALL_CATEGORIES = 'REMOVE_ALL_CATEGORIES';

/**
 * @param {Chatshier.Model.AppsCategoies} appsCategories
 */
export const updateCategories = (appsCategories) => {
    return { type: UPDATE_CATEGORIES, appsCategories };
};

/**
 * @param {string} appId
 * @param {string} categoryId
 */
export const removeCategory = (appId, categoryId) => {
    return { type: REMOVE_CATEGORY, appId, categoryId };
};

/**
 * @param {string} appId
 */
export const removeAllCategories = (appId) => {
    return { type: REMOVE_ALL_CATEGORIES, appId };
};
