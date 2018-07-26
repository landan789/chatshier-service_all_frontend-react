import { UPDATE_TICKETS, DELETE_TICKET,
    DELETE_ALL_TICKETS } from '../../actions/mainStore/appsTickets';

export const appsTicketsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TICKETS:
            for (let appId in action.appsTickets) {
                /** @type {Chatshier.Model.AppsTickets} */
                let app = action.appsTickets[appId];
                state[appId] = state[appId] || { tickets: {} };

                let tickets = app.tickets;
                for (let ticketId in tickets) {
                    /** @type {Chatshier.Model.Ticket} */
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
        case DELETE_ALL_TICKETS:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        default:
            return state;
    }
};
