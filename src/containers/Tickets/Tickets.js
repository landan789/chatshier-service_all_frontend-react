import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import apiDatabase from '../../helpers/apiDatabase/index';

import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
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

        this.appsAgents = {};
        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('待辦事項');
        setNavTitle('待辦事項');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsTickets.find(null, userId),
            apiDatabase.consumers.find(userId),
            apiDatabase.groups.find(userId),
            apiDatabase.users.find(userId)
        ]);
    }

    componentWillReceiveProps(props) {
        // 每個 app 因群組不同，指派人清單也會不同，因此須根據群組準備指派人清單
        if (Object.keys(props.appsTickets).length > 0 &&
            Object.keys(props.groups).length > 0 &&
            Object.keys(props.users).length > 0) {
            /** @type {Chatshier.AppsTickets} */
            let appsTickets = props.appsTickets;
            /** @type {Chatshier.Groups} */
            let groups = props.groups;
            /** @type {Chatshier.Users} */
            let users = props.users;

            this.appsAgents = {};
            for (let appId in appsTickets) {
                for (let groupId in groups) {
                    let group = groups[groupId];
                    if (0 <= group.app_ids.indexOf(appId)) {
                        this.appsAgents[appId] = { agents: {} };
                        for (let memberId in group.members) {
                            let memberUserId = group.members[memberId].user_id;
                            this.appsAgents[appId].agents[memberUserId] = {
                                name: users[memberUserId].name,
                                email: users[memberUserId].email
                            };
                        }
                    }
                }
            }
        }
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
            <div className="ml-auto admin-content">
                <Toolbar />
                <Fade in className="ticket-wrapper">
                    <div className="ticket-toolbar">
                        <button type="button" className="btn btn-light ticket-insert" onClick={this.openInsertModal}>
                            <span className="fas fa-plus fa-fw"></span>
                            <span>新增待辦</span>
                        </button>
                        <TicketInsertModal
                            apps={this.props.apps}
                            appsAgents={this.appsAgents}
                            consumers={this.props.consumers}
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
                        appsAgents={this.appsAgents}
                        searchKeyword={this.state.searchKeyword}>
                    </TicketTable>
                </Fade>
            </div>
        );
    }
}

Tickets.propTypes = {
    apps: PropTypes.object,
    appsTickets: PropTypes.object,
    consumers: PropTypes.object,
    groups: PropTypes.object,
    users: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    };
};

export default withRouter(connect(mapStateToProps)(Tickets));
