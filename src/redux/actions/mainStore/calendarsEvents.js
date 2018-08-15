export const UPDATE_CALENDARS_EVENTS = 'UPDATE_CALENDARS_EVENTS';
export const REMOVE_CALENDAR_EVENT = 'REMOVE_CALENDAR_EVENT';

/**
 * @param {Chatshier.CalendarsEvents} calendarsEvents
 */
export const updateCalendarsEvents = (calendarsEvents) => {
    return { type: UPDATE_CALENDARS_EVENTS, calendarsEvents };
};

/**
 * @param {string} calendarId
 * @param {string} eventId
 */
export const removeCalendarEvent = (calendarId, eventId) => {
    return { type: REMOVE_CALENDAR_EVENT, calendarId, eventId };
};
