import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateConsumers } from '../../redux/actions/consumers';

class Consumers extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'consumers/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<ConsumersResponse>}
     */
    find(userId) {
        let consumers = mainStore.getState().consumers;
        if (Object.keys(consumers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: consumers
            });
        }

        let destUrl = this.urlPrefix + 'users/' + userId;
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
     * @param {string} platformUid
     * @param {string} userId
     * @returns {Promise<AppsMessagersResponse>}
     */
    findOne(platformUid, userId) {
        let consumers = mainStore.getState().consumers;
        if (consumers[platformUid]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: consumers
            });
        }

        let destUrl = this.urlPrefix + 'consumers/' + platformUid + '/users/' + userId;
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
     * @param {string} platformUid
     * @param {string} userId
     * @param {Chatshier.Messager} messager
     * @returns {Promise<AppsMessagersResponse>}
     */
    update(platformUid, userId, consumer) {
        let destUrl = this.urlPrefix + 'consumers/' + platformUid + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(consumer)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateConsumers(resJson.data));
            return resJson;
        });
    };
}

export default Consumers;
