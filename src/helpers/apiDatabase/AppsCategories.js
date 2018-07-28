import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateCategories, deleteCategory } from '../../redux/actions/mainStore/appsCategories';

class AppsCategories extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-categories/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsCategories>}
     */
    find(appId) {
        let appsCategories = mainStore.getState().appsCategories;
        if (Object.keys(appsCategories).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsCategories
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCategories(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Category} category
     * @returns {Promise<Chatshier.Response.AppsCategories>}
     */
    insert(appId, category) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(category)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCategories(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} categoryId
     * @param {Chatshier.Models.Category} category
     * @returns {Promise<Chatshier.Response.AppsCategories>}
     */
    update(appId, categoryId, category) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/categories/' + categoryId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(category)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCategories(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} categoryId
     * @returns {Promise<Chatshier.Response.AppsCategories>}
     */
    delete(appId, categoryId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/categories/' + categoryId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteCategory(appId, categoryId));
            return resJson;
        });
    };
}

export default AppsCategories;
