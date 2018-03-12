import { UPDATE_TICKETS, DELETE_TICKET } from '../actions/appsTickets';

export const appsTicketsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TICKETS:
            for (let appId in action.appsTickets) {
                let app = action.appsTickets[appId];
                if (app.isDeleted) {
                    continue;
                }

                state[appId] = state[appId] || { tickets: {} };
                let tickets = app.tickets;
                for (let ticketId in tickets) {
                    let ticket = tickets[ticketId];
                    if (ticket.isDeleted) {
                        continue;
                    }
                    state[appId].tickets[ticketId] = ticket;
                }
            }
            return Object.assign({}, state);
        case DELETE_TICKET:
            let appId = action.appId;
            let ticketId = action.ticketId;

            delete state[appId].tickets[ticketId];
            if (0 === Object.keys(state[appId].tickets).length) {
                delete state[appId].tickets;
                delete state[appId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
