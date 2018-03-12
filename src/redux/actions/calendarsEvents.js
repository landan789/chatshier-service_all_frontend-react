export const UPDATE_CALENDARS_EVENTS = 'UPDATE_CALENDARS_EVENTS';
export const DELETE_CALENDAR_EVENT = 'DELETE_CALENDAR_EVENT';

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
export const deleteCalendarEvent = (calendarId, eventId) => {
    return { type: DELETE_CALENDAR_EVENT, calendarId, eventId };
};
