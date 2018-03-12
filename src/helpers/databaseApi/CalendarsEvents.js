import Core from './Core';
import { reqHeaders } from './index';

class CalendarsEvents extends Core {
    constructor() {
        super();
        this.urlPrefix = this.prefixUrl + 'calendars-events/';
    }

    /**
     * @param {string} userId
     */
    findAll(userId) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {string} userId
     * @param {*} calendar
     */
    insert(userId, calendar) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(calendar)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {string} calendarId
     * @param {string} eventId
     * @param {string} userId
     * @param {*} calendar
     */
    update(calendarId, eventId, userId, calendarData) {
        let destUrl = this.urlPrefix + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(calendarData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * @param {string} calendarId
     * @param {string} eventId
     * @param {string} userId
     */
    delete(calendarId, eventId, userId) {
        let destUrl = this.urlPrefix + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default CalendarsEvents;
