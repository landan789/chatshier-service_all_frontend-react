import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateProducts, removeProduct } from '../../redux/actions/mainStore/appsProducts';

class AppsProducts extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-products/';

        this.TYPES = Object.freeze({
            NORMAL: 'NORMAL',
            APPOINTMENT: 'APPOINTMENT'
        });
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    find(appId) {
        let appsProducts = mainStore.getState().appsProducts;
        if (Object.keys(appsProducts).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsProducts
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
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
     * @param {Chatshier.Models.Product} product
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    insert(appId, product) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
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
     * @param {Chatshier.Models.Product} product
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    update(appId, productId, product) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/products/' + productId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
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
     * @returns {Promise<Chatshier.Response.AppsProducts>}
     */
    delete(appId, productId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/products/' + productId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeProduct(appId, productId));
            return resJson;
        });
    };
}

export default AppsProducts;
