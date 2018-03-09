export const UPDATE_TICKETS = 'UPDATE_TICKET';
export const REMOVE_TICKET = 'REMOVE_TICKET';

export function updateTickets(appsTickets) {
    return { type: UPDATE_TICKETS, appsTickets };
}

export function removeTicket(appId, ticketId) {
    return { type: REMOVE_TICKET, appId, ticketId };
}
