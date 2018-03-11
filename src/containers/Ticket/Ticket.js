import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import { updateApps } from '../../redux/actions/apps';
import { updateMessagers } from '../../redux/actions/appsMessagers';
import { updateTickets } from '../../redux/actions/appsTickets';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import TicketInsertModal from '../../components/Modals/TicketInsert/TicketInsert';
import TicketTable from './TicketTable';

import './Ticket.css';

class Ticket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isInsertModalOpen: false,
            searchKeyword: ''
        };

        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
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

            let findAppsPromise = Promise.resolve().then(() => {
                if (Object.keys(this.props.apps).length > 0) {
                    return this.props.apps;
                }
                return dbapi.apps.findAll(userId);
            });

            let findMessagersPromise = Promise.resolve().then(() => {
                if (Object.keys(this.props.appsMessagers).length > 0) {
                    return this.props.appsMessagers;
                }
                return dbapi.appsMessagers.findAll(userId);
            });

            let findTicketsPromise = Promise.resolve().then(() => {
                if (Object.keys(this.props.appsTickets).length > 0) {
                    return this.props.appsTickets;
                }
                return dbapi.appsTickets.findAll(null, userId);
            });

            return Promise.all([
                findAppsPromise,
                findMessagersPromise,
                findTicketsPromise
            ]);
        }).then((resJsons) => {
            let apps = resJsons.shift().data;
            let appsMessagers = resJsons.shift().data;
            let appsTickets = resJsons.shift().data;

            this.props.updateApps(apps);
            this.props.updateMessagers(appsMessagers);
            this.props.updateTickets(appsTickets);
        });
    }

    keywordChanged(ev) {
        this.setState({ searchKeyword: ev.target.value });
    }

    openInsertModal(ev) {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal(ev, role, modalData) {
        if (!modalData) {
            this.setState({ isInsertModalOpen: false });
            return;
        }

        let appId = modalData.appId;
        let ticketId = modalData.ticketId;
        let insertedTicket = modalData.insertedAppsTickets;
        this.props.updateTickets(insertedTicket);

        let _appsTickets = this.props.appsTickets;
        _appsTickets[appId].tickets[ticketId] = insertedTicket;

        this.setState({
            appsTickets: _appsTickets,
            isInsertModalOpen: !this.state.isInsertModalOpen
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar ticket-wrapper">
                    <div className="ticket-toolbar">
                        <button type="button" className="btn btn-default ticket-insert" onClick={this.openInsertModal}>
                            <span className="fas fa-plus fa-fw"></span>
                            <span>新增待辦</span>
                        </button>
                        <TicketInsertModal
                            apps={this.props.apps}
                            appsMessagers={this.props.appsMessagers}
                            isOpen={this.state.isInsertModalOpen}
                            close={this.closeInsertModal}>
                        </TicketInsertModal>

                        <input
                            type="text"
                            className="ticket-search-bar"
                            placeholder="搜尋"
                            value={this.state.searchKeyword}
                            onChange={this.keywordChanged} />
                    </div>

                    <TicketTable
                        searchKeyword={this.state.searchKeyword}>
                    </TicketTable>
                </Fade>
            </Aux>
        );
    }
}

Ticket.propTypes = {
    apps: PropTypes.object,
    appsMessagers: PropTypes.object,
    appsTickets: PropTypes.object,
    updateApps: PropTypes.func.isRequired,
    updateMessagers: PropTypes.func.isRequired,
    updateTickets: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        apps: state.apps,
        appsMessagers: state.appsMessagers,
        appsTickets: state.appsTickets
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateApps: bindActionCreators(updateApps, dispatch),
        updateMessagers: bindActionCreators(updateMessagers, dispatch),
        updateTickets: bindActionCreators(updateTickets, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ticket));
