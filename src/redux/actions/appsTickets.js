export const UPDATE_TICKETS = 'UPDATE_TICKET';
export const DELETE_TICKET = 'DELETE_TICKET';

export function updateTickets(appsTickets) {
    return { type: UPDATE_TICKETS, appsTickets };
}

export function deleteTicket(appId, ticketId) {
    return { type: DELETE_TICKET, appId, ticketId };
}
