import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateTickets, removeTicket } from '../../redux/actions/mainStore/appsTickets';

class AppsTickets extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-tickets/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsTickets>}
     */
    find(appId) {
        let appsTickets = mainStore.getState().appsTickets;
        if (Object.keys(appsTickets).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsTickets
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
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
     * @param {Chatshier.Model.Ticket} ticket
     * @returns {Promise<Chatshier.Response.AppsTickets>}
     */
    insert(appId, ticket) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/users/' + this.userId;
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
     * @param {Chatshier.Model.Ticket} ticket
     * @returns {Promise<Chatshier.Response.AppsTickets>}
     */
    update(appId, ticketId, ticket) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + this.userId;
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
     * @returns {Promise<Chatshier.Response.AppsTickets>}
     */
    delete(appId, ticketId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/tickets/' + ticketId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeTicket(appId, ticketId));
            return resJson;
        });
    };
}

export default AppsTickets;
