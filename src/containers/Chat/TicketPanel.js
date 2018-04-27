import React from 'react';
import PropTypes from 'prop-types';

class TicketPanel extends React.Component {
    static propTypes = {
        appsChatrooms: PropTypes.object,
        appsTickets: PropTypes.object,
        consumers: PropTypes.object,
        users: PropTypes.object
    }

    render() {
        return (
            <div className="ticket-panel">
                ticketPanel
            </div>
        );
    }
}

export default TicketPanel;
