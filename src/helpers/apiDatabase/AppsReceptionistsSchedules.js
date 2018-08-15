import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateReceptionistsSchedules, removeReceptionistSchedule } from '../../redux/actions/mainStore/appsReceptionists';

class AppsReceptionistsSchedules extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'apps-receptionists-schedules/';
    }

    /**
     * @param {string} appId
     * @param {string} receptionistId
     * @param {Chatshier.Models.Schedule} schedule
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    insert(appId, receptionistId, schedule) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/receptionists/' + receptionistId + '/users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(schedule)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateReceptionistsSchedules(appId, receptionistId, resJson.data[appId].receptionists[receptionistId].schedules));
            return resJson;
        });
    }

    /**
     * @param {string} appId
     * @param {string} receptionistId
     * @param {string} scheduleId
     * @param {Chatshier.Models.Schedule} schedule
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    update(appId, receptionistId, scheduleId, schedule) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/receptionists/' + receptionistId + '/schedules/' + scheduleId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(schedule)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateReceptionistsSchedules(appId, receptionistId, resJson.data[appId].receptionists[receptionistId].schedules));
            return resJson;
        });
    };

    /**
     * @param {string} appId
     * @param {string} receptionistId
     * @param {string} scheduleId
     * @returns {Promise<Chatshier.Response.AppsReceptionists>}
     */
    delete(appId, receptionistId, scheduleId) {
        let destUrl = this.apiEndPoint + 'apps/' + appId + '/receptionists/' + receptionistId + '/schedules/' + scheduleId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeReceptionistSchedule(appId, receptionistId, scheduleId));
            return resJson;
        });
    };
}

export default AppsReceptionistsSchedules;
