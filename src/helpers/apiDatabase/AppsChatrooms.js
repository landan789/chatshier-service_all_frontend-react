import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateChatrooms } from '../../redux/actions/mainStore/appsChatrooms';

class AppsChatrooms extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-chatrooms/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.AppsChatrooms>}
     */
    find(userId) {
        let appsChatrooms = mainStore.getState().appsChatrooms;
        if (Object.keys(appsChatrooms).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsChatrooms
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateChatrooms(resJson.data));
            return resJson;
        });
    }

    /**
     * @param {string} appId
     * @param {string} chatroomId
     * @param {any} putChatroom
     * @param {string} userId
     */
    update(appId, chatroomId, putChatroom, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/chatrooms/' + chatroomId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(putChatroom)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateChatrooms(resJson.data));
            return resJson;
        });
    }
}

export default AppsChatrooms;
