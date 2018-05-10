import { UPDATE_CALENDARS_EVENTS, DELETE_CALENDAR_EVENT } from '../../actions/mainStore/calendarsEvents';

export const calendarsEventsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CALENDARS_EVENTS:
            for (let calendarId in action.calendarsEvents) {
                /** @type {Chatshier.CalendarsEvents} */
                let calendar = action.calendarsEvents[calendarId];
                state[calendarId] = state[calendarId] || { events: {} };

                let events = calendar.events;
                for (let eventId in events) {
                    /** @type {Chatshier.CalendarEvent} */
                    let event = events[eventId];
                    if (event.isDeleted) {
                        continue;
                    }
                    state[calendarId].events[eventId] = event;
                }
            }
            return Object.assign({}, state);
        case DELETE_CALENDAR_EVENT:
            let calendarId = action.calendarId;
            let eventId = action.eventId;

            delete state[calendarId].events[eventId];
            if (0 === Object.keys(state[calendarId].events).length) {
                delete state[calendarId].events;
                delete state[calendarId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
