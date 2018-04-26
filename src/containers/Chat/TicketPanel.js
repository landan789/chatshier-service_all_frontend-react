import React from 'react';
import PropTypes from 'prop-types';

class TicketPanel extends React.Component {
    render() {
        return (
            <div className="ticket-panel">
                ticketPanel
            </div>
        );
    }
}

TicketPanel.propTypes = {
    appsChatrooms: PropTypes.object,
    appsTickets: PropTypes.object,
    consumers: PropTypes.object,
    users: PropTypes.object
};

export default TicketPanel;
