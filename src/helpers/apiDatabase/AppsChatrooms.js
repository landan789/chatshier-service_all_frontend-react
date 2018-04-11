import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateChatroomsMessages } from '../../redux/actions/appsChatrooms';

class AppsChatrooms extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'apps-chatrooms/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<AppsChatroomsResponse>}
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

        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateChatroomsMessages(resJson.data));
            return resJson;
        });
    };
}

export default AppsChatrooms;
