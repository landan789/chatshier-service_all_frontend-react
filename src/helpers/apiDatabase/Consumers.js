import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateConsumers } from '../../redux/actions/mainStore/consumers';

class Consumers extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'consumers/';
    }

    /**
     * @returns {Promise<Chatshier.Response.Consumers>}
     */
    find() {
        let consumers = mainStore.getState().consumers;
        if (Object.keys(consumers).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: consumers
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
     * @returns {Promise<Chatshier.Response.Consumers>}
     */
    findOne(platformUid) {
        let consumers = mainStore.getState().consumers;
        if (consumers[platformUid]) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: consumers
            });
        }

        let destUrl = this.apiEndPoint + 'consumers/' + platformUid + '/users/' + this.userId;
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
     * @param {Chatshier.Model.Consumer} consumer
     * @returns {Promise<Chatshier.Response.Consumer>}
     */
    update(platformUid, consumer) {
        let destUrl = this.apiEndPoint + 'consumers/' + platformUid + '/users/' + this.userId;
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
