import { UPDATE_TICKETS, REMOVE_TICKET } from '../actions/appsTickets';

export const appsTicketsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TICKETS:
            for (let appId in action.appsTickets) {
                state[appId] = state[appId] || { tickets: {} };

                let tickets = action.appsTickets[appId].tickets;
                for (let ticketId in tickets) {
                    state[appId].tickets[ticketId] = tickets[ticketId];
                }
            }
            return state;
        case REMOVE_TICKET:
            delete state[action.appId].tickets[action.ticketId];
            if (0 === Object.keys(state[action.appId].tickets).length) {
                delete state[action.appId].tickets;
                delete state[action.appId];
            }
            return state;
        default:
            return state;
    }
};
