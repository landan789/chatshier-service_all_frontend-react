import React from 'react';
import PropTypes from 'prop-types';

class TicketTable extends React.Component {
    renderTickets() {
        if (!this.props.appsTickets) {
            return;
        }

        let appIds = Object.keys(this.props.appsTickets);
        let ticketCmps = [];

        appIds.forEach((appId) => {
            let tickets = this.props.appsTickets[appId].tickets;
            let ticketIds = Object.keys(tickets);

            ticketIds.forEach((ticketId) => {
                let ticket = tickets[ticketId];
                let messagerId = ticket.messager_id;
                let messager = this.props.appsMessagers[appId].messagers[messagerId];

                ticketCmps.push(
                    <tr key={ticketId} className="ticket-row">
                        <td>{messager.name || ''}</td>
                        <td>{ticket.description.substring(0, 10)}</td>
                        <td className="status">{ticket.status}</td>
                        <td className="priority">{ticket.priority}</td>
                        <td>{ticket.dueTime}</td>
                        <td>{ticket.dueTime}</td>
                    </tr>
                );
            });
        });
        return ticketCmps;
    };

    render() {
        return (
            <div className="ticket">
                <table>
                    <thead>
                        <tr>
                            <th>客戶姓名</th>
                            <th>內容</th>
                            <th>狀態</th>
                            <th>優先</th>
                            <th>到期時間</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="ticket-body">
                        {this.renderTickets()}
                    </tbody>
                </table>
            </div>
        );
    }
}

TicketTable.propTypes = {
    appsTickets: PropTypes.object,
    appsMessagers: PropTypes.object
};

export default TicketTable;
