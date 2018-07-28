import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateApps, deleteApp } from '../../redux/actions/mainStore/apps';
import { deleteAllAutoreplies } from '../../redux/actions/mainStore/appsAutoreplies';
import { deleteAllCategories } from '../../redux/actions/mainStore/appsCategories';
import { deleteAllChatrooms } from '../../redux/actions/mainStore/appsChatrooms';
import { deleteAllComposes } from '../../redux/actions/mainStore/appsComposes';
import { deleteAllFields } from '../../redux/actions/mainStore/appsFields';
import { deleteAllGreetings } from '../../redux/actions/mainStore/appsGreetings';
import { deleteAllKeywordreplies } from '../../redux/actions/mainStore/appsKeywordreplies';
import { deleteAllTickets } from '../../redux/actions/mainStore/appsTickets';

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
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    find(userId) {
        let apps = mainStore.getState().apps;
        if (Object.keys(apps).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: apps
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    findOne(appId, userId) {
        let apps = mainStore.getState().apps;
        if (apps[appId]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: { [appId]: apps[appId] }
            });
        }

        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Model.App} app
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    insert(userId, app) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.Model.App} app
     * @returns {Promise<Chatshier.Response.Apps>}
     */
    update(appId, userId, app) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
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
     * @param {string} userId
     */
    delete(appId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteApp(appId));
            mainStore.dispatch(deleteAllAutoreplies(appId));
            mainStore.dispatch(deleteAllCategories(appId));
            mainStore.dispatch(deleteAllChatrooms(appId));
            mainStore.dispatch(deleteAllComposes(appId));
            mainStore.dispatch(deleteAllFields(appId));
            mainStore.dispatch(deleteAllGreetings(appId));
            mainStore.dispatch(deleteAllKeywordreplies(appId));
            mainStore.dispatch(deleteAllTickets(appId));
            return resJson;
        });
    };
}

export default Apps;
