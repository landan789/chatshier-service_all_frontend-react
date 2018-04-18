import Core from './Core';
import { reqHeaders } from './index';

import mainStore from '../../redux/mainStore';
import { updateCalendarsEvents, deleteCalendarEvent } from '../../redux/actions/calendarsEvents';

class CalendarsEvents extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'calendars-events/';
    }

    /**
     * @param {string} userId
     * @returns {Promise<CalendarsEventsResponse>}
     */
    find(userId) {
        let calendarsEvents = mainStore.getState().calendarsEvents;
        if (Object.keys(calendarsEvents).length > 0) {
            return Promise.resolve({
                status: 1,
                msg: '',
                data: calendarsEvents
            });
        }

        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @returns {Promise<CalendarsEventsResponse>}
     */
    insert(userId, calendarEvent) {
        let destUrl = this.apiEndPoint + 'users/' + userId;
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
     * @param {string} userId
     * @param {Chatshier.CalendarEvent} calendarEvent
     * @returns {Promise<CalendarsEventsResponse>}
     */
    update(calendarId, eventId, userId, calendarEvent) {
        let destUrl = this.apiEndPoint + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
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
     * @param {string} userId
     * @returns {Promise<CalendarsEventsResponse>}
     */
    delete(calendarId, eventId, userId) {
        let destUrl = this.apiEndPoint + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit).then((resJson) => {
            mainStore.dispatch(deleteCalendarEvent(calendarId, eventId));
            return resJson;
        });
    };
}

export default CalendarsEvents;
