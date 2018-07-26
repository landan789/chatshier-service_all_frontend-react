export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const DELETE_ALL_CATEGORIES = 'DELETE_ALL_CATEGORIES';

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
export const deleteCategory = (appId, categoryId) => {
    return { type: DELETE_CATEGORY, appId, categoryId };
};

/**
 * @param {string} appId
 */
export const deleteAllCategories = (appId) => {
    return { type: DELETE_ALL_CATEGORIES, appId };
};
