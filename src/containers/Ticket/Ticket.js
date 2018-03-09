import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import { updateMessagers } from '../../redux/actions/appsMessagers';
import { updateTickets } from '../../redux/actions/appsTickets';

class Ticket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        browserHelper.setTitle('待辦事項');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;

            return Promise.all([
                Object.keys(this.props.appsTickets).length > 0 ? Promise.resolve(this.props.appsTickets) : dbapi.appsTickets.findAll(null, userId),
                Object.keys(this.props.appsMessagers).length > 0 ? Promise.resolve(this.props.appsMessagers) : dbapi.appsMessagers.findAll(userId)
            ]);
        }).then((resJsons) => {
            let appsTickets = resJsons.shift().data;
            let appsMessagers = resJsons.shift().data;

            this.setState({
                appsTickets: appsTickets,
                appsMessagers: appsMessagers
            });

            this.props.updateTickets(appsTickets);
            this.props.updateMessagers(appsMessagers);
        });
    }

    renderTickets() {
        if (!this.state.appsTickets) {
            return;
        }

        let appIds = Object.keys(this.state.appsTickets);
        let ticketCmps = [];

        appIds.forEach((appId) => {
            let tickets = this.state.appsTickets[appId].tickets;
            let ticketIds = Object.keys(tickets);

            ticketIds.forEach((ticketId) => {
                let ticket = tickets[ticketId];
                let messagerId = ticket.messager_id;
                let messager = this.state.appsMessagers[appId].messagers[messagerId];

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
    }

    render() {
        console.log(this.state);
        return (
            <div className="main">
                <div className="view-ticket top-toolbar">
                    <a href="/ticket_form" className="btn btn-default ticket-add">
                        <span className="fa fa-plus fa-fw"></span>
                        <span>新增待辦</span>
                    </a>
                    <input type="text" className="ticket-search-bar" id="ticket_search_bar" value="" placeholder="搜尋" />
                </div>

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
            </div>
        );
    }
}

Ticket.propTypes = {
    appsTickets: PropTypes.object,
    appsMessagers: PropTypes.object,
    updateMessagers: PropTypes.func.isRequired,
    updateTickets: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        appsMessagers: state.appsMessagers,
        appsTickets: state.appsTickets
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateMessagers: bindActionCreators(updateMessagers, dispatch),
        updateTickets: bindActionCreators(updateTickets, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ticket));
