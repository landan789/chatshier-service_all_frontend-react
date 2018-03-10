import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Aux from 'react-aux';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import { updateMessagers } from '../../redux/actions/appsMessagers';
import { updateTickets } from '../../redux/actions/appsTickets';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import TicketTable from './TicketTable';

import './Ticket.css';

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

    render() {
        return (
            <Aux>
                <Toolbar />
                <div className="ticket-wrapper">
                    <div className="view-ticket top-toolbar">
                        <button type="button" className="btn btn-default ticket-add">
                            <span className="fas fa-plus fa-fw"></span>
                            <span>新增待辦</span>
                        </button>
                        <input type="text" className="ticket-search-bar" placeholder="搜尋" />
                    </div>

                    <TicketTable
                        appsTickets={this.state.appsTickets}
                        appsMessagers={this.state.appsMessagers}>
                    </TicketTable>
                </div>
            </Aux>
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
