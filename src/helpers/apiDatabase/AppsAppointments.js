import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateAppointments, deleteAppointment } from '../../redux/actions/mainStore/appsAppointments';

class AppsAppointments extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-appointments/';
    }

    /**
     * @param {string} [appId]
     * @returns {Promise<Chatshier.Response.AppsAppointments>}
     */
    find(appId) {
        let appsAppointments = mainStore.getState().appsAppointments;
        if (Object.keys(appsAppointments).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: appsAppointments
            });
        }

        let destUrl = this.apiEndPoint + (appId ? ('apps/' + appId + '/') : '') + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateAppointments(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} appointmentId
     * @param {Chatshier.Models.Appointment} appointment
     * @returns {Promise<Chatshier.Response.AppsAppointments>}
     */
    update(appId, appointmentId, appointment) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/appointments/' + appointmentId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(appointment)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateAppointments(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} appointmentId
     * @returns {Promise<Chatshier.Response.AppsAppointments>}
     */
    delete(appId, appointmentId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/appointments/' + appointmentId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteAppointment(appId, appointmentId));
            return resJson;
        });
    };
}

export default AppsAppointments;
