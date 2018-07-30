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
     * @returns {Promise<Chatshier.Response.Users>}
     */
    find() {
        let users = mainStore.getState().users;
        if (Object.keys(users).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: users
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
     * @param {string} email
     * @returns {Promise<Chatshier.Response.Users>}
     */
    search(email) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId + '?email=' + email + '&fuzzy=1';
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {Chatshier.Models.User} user
     * @returns {Promise<Chatshier.Response.Users>}
     */
    update(user) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
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
