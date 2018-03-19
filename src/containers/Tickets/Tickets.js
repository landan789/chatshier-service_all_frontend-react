import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import TicketInsertModal from '../../components/Modals/TicketInsert/TicketInsert';
import TicketTable from './TicketTable';

import './Tickets.css';

class Tickets extends React.Component {
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
            return userId && Promise.all([
                dbapi.apps.findAll(userId),
                dbapi.appsMessagers.findAll(userId),
                dbapi.appsTickets.findAll(null, userId)
            ]);
        });
    }

    keywordChanged(ev) {
        this.setState({ searchKeyword: ev.target.value });
    }

    openInsertModal(ev) {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal(ev) {
        this.setState({ isInsertModalOpen: false });
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

Tickets.propTypes = {
    apps: PropTypes.object,
    appsMessagers: PropTypes.object,
    appsTickets: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: state.apps,
        appsMessagers: state.appsMessagers,
        appsTickets: state.appsTickets
    };
};

export default withRouter(connect(mapStateToProps)(Tickets));
