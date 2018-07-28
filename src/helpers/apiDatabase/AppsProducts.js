import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateProducts, deleteProduct } from '../../redux/actions/mainStore/appsProducts';

class AppsProducts extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-products/';
    }

    /**
     * @param {string} [appId]
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    find(appId, userId) {
        let appsProducts = mainStore.getState().appsProducts;
        if (Object.keys(appsProducts).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsProducts
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateProducts(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Models.Product} product
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    insert(appId, userId, product) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(product)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateProducts(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} productId
     * @param {string} userId
     * @param {Chatshier.Models.Product} product
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    update(appId, productId, userId, category) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/products/' + productId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(category)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateProducts(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} productId
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    delete(appId, productId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/products/' + productId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteProduct(appId, productId));
            return resJson;
        });
    };
}

export default AppsProducts;
