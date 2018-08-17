import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateApps, removeApp } from '../../redux/actions/mainStore/apps';
import { removeAllAutoreplies } from '../../redux/actions/mainStore/appsAutoreplies';
import { removeAllCategories } from '../../redux/actions/mainStore/appsCategories';
import { removeAllChatrooms } from '../../redux/actions/mainStore/appsChatrooms';
import { removeAllComposes } from '../../redux/actions/mainStore/appsComposes';
import { removeAllFields } from '../../redux/actions/mainStore/appsFields';
import { removeAllGreetings } from '../../redux/actions/mainStore/appsGreetings';
import { removeAllKeywordreplies } from '../../redux/actions/mainStore/appsKeywordreplies';
import { removeAllProducts } from '../../redux/actions/mainStore/appsProducts';
import { removeAllReceptionists } from '../../redux/actions/mainStore/appsReceptionists';
import { removeAllTickets } from '../../redux/actions/mainStore/appsTickets';

class Apps extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps/';

        this.TYPES = Object.freeze({
            SYSTEM: 'SYSTEM',
            CHATSHIER: 'CHATSHIER',
            LINE: 'LINE',
            FACEBOOK: 'FACEBOOK',
            WECHAT: 'WECHAT'
        });
    }

    /**
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    find() {
        let apps = mainStore.getState().apps;
        if (Object.keys(apps).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: apps
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    findOne(appId) {
        let apps = mainStore.getState().apps;
        if (apps[appId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: { [appId]: apps[appId] }
            });
        }

        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {Chatshier.Model.App} app
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    insert(app) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {Chatshier.Model.App} app
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    update(appId, app) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(app)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateApps(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     */
    remove(appId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeApp(appId));
            mainStore.dispatch(removeAllAutoreplies(appId));
            mainStore.dispatch(removeAllCategories(appId));
            mainStore.dispatch(removeAllChatrooms(appId));
            mainStore.dispatch(removeAllComposes(appId));
            mainStore.dispatch(removeAllFields(appId));
            mainStore.dispatch(removeAllGreetings(appId));
            mainStore.dispatch(removeAllKeywordreplies(appId));
            mainStore.dispatch(removeAllProducts(appId));
            mainStore.dispatch(removeAllReceptionists(appId));
            mainStore.dispatch(removeAllTickets(appId));
            return resJson;
        });
    };
}

export default Apps;
