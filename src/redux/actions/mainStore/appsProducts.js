export const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const REMOVE_ALL_PRODUCTS = 'REMOVE_ALL_PRODUCTS';

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
export const removeProduct = (appId, productId) => {
    return { type: REMOVE_PRODUCT, appId, productId };
};

/**
 * @param {string} appId
 */
export const removeAllProducts = (appId) => {
    return { type: REMOVE_ALL_PRODUCTS, appId };
};
