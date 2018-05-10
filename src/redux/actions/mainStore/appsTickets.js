export const UPDATE_TICKETS = 'UPDATE_TICKET';
export const DELETE_TICKET = 'DELETE_TICKET';

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
