import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateMessages } from '../../redux/actions/appsChatroomsMessages';

class AppsChatroomsMessages extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-chatrooms-messages/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsChatroomsMessagesResponse>}
     */
    findAll(userId) {
        let appsChatroomsMessages = mainStore.getState().appsChatroomsMessages;
        if (Object.keys(appsChatroomsMessages).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsChatroomsMessages
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateMessages(resJson.data));
            return resJson;
        });
    };
}

export default AppsChatroomsMessages;
