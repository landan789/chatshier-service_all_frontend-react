export const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const DELETE_ALL_PRODUCTS = 'DELETE_ALL_PRODUCTS';

/**
 * @param {Chatshier.Model.AppsProducts} appsProducts
 */
export const updateProducts = (appsProducts) => {
    return { type: UPDATE_PRODUCTS, appsProducts };
};

/**
 * @param {string} appId
 * @param {string} productId
 */
export const deleteProduct = (appId, productId) => {
    return { type: DELETE_PRODUCT, appId, productId };
};

/**
 * @param {string} appId
 */
export const deleteAllProducts = (appId) => {
    return { type: DELETE_ALL_PRODUCTS, appId };
};
