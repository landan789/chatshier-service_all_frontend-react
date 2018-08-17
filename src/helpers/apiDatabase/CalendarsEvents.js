import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateCalendarsEvents, removeCalendarEvent } from '../../redux/actions/mainStore/calendarsEvents';

class CalendarsEvents extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'calendars-events/';
    }

    /**
     * @returns {Promise<Chatshier.Response.CalendarsEvents>}
     */
    find() {
        let calendarsEvents = mainStore.getState().calendarsEvents;
        if (Object.keys(calendarsEvents).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: calendarsEvents
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCalendarsEvents(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} userId
     * @param {Chatshier.CalendarEvent} calendarEvent
     * @returns {Promise<Chatshier.Response.CalendarsEvents>}
     */
    insert(calendarEvent) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(calendarEvent)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCalendarsEvents(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} calendarId
     * @param {string} eventId
     * @param {Chatshier.CalendarEvent} calendarEvent
     * @returns {Promise<Chatshier.Response.CalendarsEvents>}
     */
    update(calendarId, eventId, calendarEvent) {
        let destUrl = this.apiEndPoint + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + this.userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(calendarEvent)
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(updateCalendarsEvents(resJson.data));
            return resJson;
        });
    };

    /**
     * @param {string} calendarId
     * @param {string} eventId
     * @returns {Promise<Chatshier.Response.CalendarsEvents>}
     */
    remove(calendarId, eventId) {
        let destUrl = this.apiEndPoint + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + this.userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(removeCalendarEvent(calendarId, eventId));
            return resJson;
        });
    };
}

export default CalendarsEvents;
