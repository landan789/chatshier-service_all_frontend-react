export const UPDATE_TICKETS = 'UPDATE_TICKET';
export const DELETE_TICKET = 'DELETE_TICKET';
export const DELETE_ALL_TICKETS = 'DELETE_ALL_TICKETS';

/**
 * @param {Chatshier.AppsTickets} appsTickets
 */
export const updateTickets = (appsTickets) => {
    return { type: UPDATE_TICKETS, appsTickets };
};

/**
 * @param {string} appId
 * @param {string} ticketId
 */
export const deleteTicket = (appId, ticketId) => {
    return { type: DELETE_TICKET, appId, ticketId };
};

/**
 * @param {string} appId
 */
export const deleteAllTickets = (appId) => {
    return { type: DELETE_ALL_TICKETS, appId };
};
