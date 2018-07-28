import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateUsers } from '../../redux/actions/mainStore/users';

class Users extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'users/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<Chatshier.Response.Users>}
     */
    find(userId) {
        let users = mainStore.getState().users;
        if (Object.keys(users).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: users
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateUsers(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @param {string} email
     * @returns {Promise<Chatshier.Response.Users>}
     */
    search(userId, email) {
        let destUrl = this.apiEndPoint + 'users/' + userId + '?email=' + email + '&fuzzy=1';
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {string} userId
     * @param {Chatshier.Models.User} user
     * @returns {Promise<Chatshier.Response.Users>}
     */
    insert(userId, user) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {Chatshier.Models.User} user
     * @returns {Promise<Chatshier.Response.Users>}
     */
    update(userId, user) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
        let reqInit = {
            method: 'PUT',
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
