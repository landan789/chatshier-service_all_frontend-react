import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import Toolbar, { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import TicketInsertModal from '../../components/Modals/TicketInsert/TicketInsert';
import TicketTable from './TicketTable';

import './Tickets.css';

class Tickets extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsTickets: PropTypes.object,
        consumers: PropTypes.object,
        groups: PropTypes.object,
        users: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isInsertModalOpen: false,
            searchKeyword: '',
            appsAgents: {}
        };

        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('待辦事項');
        setNavTitle('待辦事項');

        if (!authHelper.hasSignedin()) {
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
        ]).then((resJsons) => {
            // 每個 app 因群組不同，指派人清單也會不同，因此須根據群組準備指派人清單
            let appsTickets = resJsons[1].data;
            let groups = resJsons[3].data;
            let users = resJsons[4].data;

            let appsAgents = {};
            for (let appId in appsTickets) {
                for (let groupId in groups) {
                    let group = groups[groupId];
                    if (0 <= group.app_ids.indexOf(appId)) {
                        appsAgents[appId] = { agents: {} };
                        for (let memberId in group.members) {
                            let memberUserId = group.members[memberId].user_id;
                            appsAgents[appId].agents[memberUserId] = {
                                name: users[memberUserId].name,
                                email: users[memberUserId].email
                            };
                        }
                    }
                }
            }
            this.setState({ appsAgents: appsAgents });
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
                <ControlPanel />
                <div className="ml-auto w-100 page-wrapper">
                    <Toolbar />
                    <Fade in className="mt-5 container ticket-wrapper">
                        <div className="pb-5 chsr card">
                            <div className="mx-4 ticket-toolbar">
                                <button type="button" className="btn btn-light ticket-insert" onClick={this.openInsertModal}>
                                    <span className="fas fa-plus fa-fw"></span>
                                    <span>新增待辦</span>
                                </button>
                                <TicketInsertModal
                                    apps={this.props.apps}
                                    appsAgents={this.state.appsAgents}
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

                            <TicketTable className="mx-4"
                                appsAgents={this.state.appsAgents}
                                searchKeyword={this.state.searchKeyword}>
                            </TicketTable>
                        </div>
                    </Fade>
                </div>
            </Aux>
        );
    }
}

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
