import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateUsers } from '../../redux/actions/users';

class Users extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'users/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<UsersResponse>}
     */
    findOne(userId) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            methods: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateUsers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @param {Chatshier.User} user
     * @returns {Promise<UsersResponse>}
     */
    insert(userId, user) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateUsers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @param {Chatshier.User} user
     * @returns {Promise<UsersResponse>}
     */
    update(userId, user) {
        let destUrl = this.prefixUrl + 'users/' + userId;
        let reqInit = {
            medthod: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(user)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateUsers(resJson.data));
            return resJson;
        });
    };
}

export default Users;
