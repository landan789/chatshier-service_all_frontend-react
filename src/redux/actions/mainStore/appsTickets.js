export const UPDATE_TICKETS = 'UPDATE_TICKET';
export const REMOVE_TICKET = 'REMOVE_TICKET';
export const REMOVE_ALL_TICKETS = 'REMOVE_ALL_TICKETS';

/**
 * @param {Chatshier.Model.AppsTickets} appsTickets
 */
export const updateTickets = (appsTickets) => {
    return { type: UPDATE_TICKETS, appsTickets };
};

/**
 * @param {string} appId
 * @param {string} ticketId
 */
export const removeTicket = (appId, ticketId) => {
    return { type: REMOVE_TICKET, appId, ticketId };
};

/**
 * @param {string} appId
 */
export const removeAllTickets = (appId) => {
    return { type: REMOVE_ALL_TICKETS, appId };
};
