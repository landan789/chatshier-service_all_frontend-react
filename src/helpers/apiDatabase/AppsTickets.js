import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateTickets, deleteTicket } from '../../redux/actions/mainStore/appsTickets';

class AppsTickets extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-tickets/';
    }

    /**
     * @param {string|null} appId
     * @param {string} userId
     * @returns {Promise<AppsTicketsResponse>}
     */
    find(appId, userId) {
        let appsTickets = mainStore.getState().appsTickets;
        if (Object.keys(appsTickets).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsTickets
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTickets(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} userId
     * @param {Chatshier.Ticket} ticket
     * @returns {Promise<AppsTicketsResponse>}
     */
    insert(appId, userId, ticket) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(ticket)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTickets(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} ticketId
     * @param {string} userId
     * @param {Chatshier.Ticket} ticket
     * @returns {Promise<AppsTicketsResponse>}
     */
    update(appId, ticketId, userId, ticket) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(ticket)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateTickets(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} ticketId
     * @param {string} userId
     */
    delete(appId, ticketId, userId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteTicket(appId, ticketId));
            return resJson;
        });
    };
}

export default AppsTickets;
