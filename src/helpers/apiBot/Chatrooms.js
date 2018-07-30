import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { deleteChatroom } from '../../redux/actions/mainStore/appsChatrooms';
import { updateConsumers } from '../../redux/actions/mainStore/consumers';

class Chatrooms extends Core {
    /**
     * @param {string} appId
     * @param {string} platformUid
     */
    getProfile(appId, platformUid) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/consumers/' + platformUid;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateConsumers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} chatroomId
     */
    leaveGroupRoom(appId, chatroomId) {
        let destUrl = this.apiEndPoint + 'leave-group-room/apps/' + appId + '/chatrooms/' + chatroomId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteChatroom(appId, chatroomId));
            return resJson;
        });
    };
}

export default Chatrooms;
