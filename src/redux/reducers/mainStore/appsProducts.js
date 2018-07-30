import { UPDATE_PRODUCTS, DELETE_PRODUCT,
    DELETE_ALL_PRODUCTS } from '../../actions/mainStore/appsProducts';

export const appsProductsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            for (let appId in action.appsProducts) {
                /** @type {Chatshier.Model.AppsProducts} */
                let app = action.appsProducts[appId];
                state[appId] = state[appId] || { products: {} };

                let products = app.products;
                for (let productId in products) {
                    /** @type {Chatshier.Model.Product} */
                    let product = products[productId];
                    if (product.isDeleted) {
                        continue;
                    }
                    state[appId].products[productId] = product;
                }
            }
            return Object.assign({}, state);
        case DELETE_PRODUCT:
            let appId = action.appId;
            let productId = action.productId;

            delete state[appId].products[productId];
            if (0 === Object.keys(state[appId].products).length) {
                delete state[appId].products;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_PRODUCTS:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        default:
            return state;
    }
};
