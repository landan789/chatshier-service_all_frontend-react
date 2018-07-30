import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card, ButtonGroup, Button, UncontrolledTooltip } from 'reactstrap';
// import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import TicketInsertModal from '../../components/Modals/TicketInsert/TicketInsert';
import TicketContent from './TicketContent';

import './Tickets.css';

export const PRIORITY_TYPES = Object.freeze({
    0: 'NONE',
    1: 'LOW',
    2: 'MEDIUM',
    3: 'HIGH',
    4: 'URGENT',
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4
});

export const STATUS_TYPES = Object.freeze({
    0: 'NONE',
    2: 'PENDING',
    3: 'PROCESSING',
    4: 'RESOLVED',
    5: 'CLOSED',
    NONE: 0,
    PENDING: 2,
    PROCESSING: 3,
    RESOLVED: 4,
    CLOSED: 5
});

class Tickets extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsChatrooms: PropTypes.object.isRequired,
        appsTickets: PropTypes.object.isRequired,
        consumers: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired,
        users: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        /** @type {Chatshier.Model.Apps} */
        let apps = nextProps.apps;
        /** @type {Chatshier.Model.Groups} */
        let groups = nextProps.groups;
        /** @type {Chatshier.Model.Users} */
        let users = nextProps.users;

        if (Object.keys(apps).length > 0 &&
            Object.keys(groups).length > 0 &&
            Object.keys(users).length > 0) {
            let appsAgents = {};
            for (let appId in apps) {
                for (let groupId in groups) {
                    let group = groups[groupId];
                    if (group.app_ids.indexOf(appId) < 0) {
                        continue;
                    }

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
            nextState.appsAgents = appsAgents;
        }
        return nextState;
    }

    constructor(props) {
        super(props);

        this.keywordChanged = this.keywordChanged.bind(this);
        this.appChanged = this.appChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);

        browserHelper.setTitle(this.props.t('To-Do items'));
        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }

        this.state = Object.assign({
            prevProps: null,
            statusFilter: STATUS_TYPES.NONE,
            isInsertModalOpen: false,
            searchKeyword: '',
            appId: '',
            appsAgents: {}
        }, Tickets.getDerivedStateFromProps(props, {}));
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsChatrooms.find(),
            apiDatabase.appsTickets.find(),
            apiDatabase.consumers.find(),
            apiDatabase.groups.find(),
            apiDatabase.users.find()
        ]);
    }

    keywordChanged(ev) {
        this.setState({ searchKeyword: ev.target.value });
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    openInsertModal() {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal() {
        this.setState({ isInsertModalOpen: false });
    }

    render() {
        let appId = this.state.appId;
        let pendingCount = 0;
        let processingCount = 0;
        let resolvedCount = 0;
        let closedCount = 0;

        if (appId && this.props.appsTickets[appId]) {
            let tickets = this.props.appsTickets[appId].tickets;
            for (let ticketId in tickets) {
                let ticket = tickets[ticketId];
                (ticket.status === STATUS_TYPES.PENDING) && pendingCount++;
                (ticket.status === STATUS_TYPES.PROCESSING) && processingCount++;
                (ticket.status === STATUS_TYPES.RESOLVED) && resolvedCount++;
                (ticket.status === STATUS_TYPES.CLOSED) && closedCount++;
            }
        }
        let totalCount = pendingCount + processingCount + resolvedCount + closedCount;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('To-Do items')}>
                    <Fade in className="align-items-center mt-5 container ticket-wrapper">
                        <Card className="pb-5 chsr">
                            <div className="mx-4 mb-3 px-3 ticket-toolbar">
                                <ButtonGroup className="mr-auto">
                                    <Button color="light" id="allTicketsFilter"
                                        className={this.state.statusFilter === STATUS_TYPES.NONE ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.NONE })}>
                                        <i className="text-muted fas fa-list-alt fa-1p5x"></i>
                                        <span className="position-absolute badge badge-success ticket-badge">{totalCount > 99 ? '99+' : totalCount}</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" delay={0} target="allTicketsFilter">全部</UncontrolledTooltip>

                                    <Button color="light" id="pendingFilter"
                                        className={this.state.statusFilter === STATUS_TYPES.PENDING ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.PENDING })}>
                                        <i className="text-muted fas fa-times-circle fa-1p5x"></i>
                                        <span className="position-absolute badge badge-success ticket-badge">{pendingCount > 99 ? '99+' : pendingCount}</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" delay={0} target="pendingFilter">未處理</UncontrolledTooltip>

                                    <Button color="light" id="processingFilter"
                                        className={this.state.statusFilter === STATUS_TYPES.PROCESSING ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.PROCESSING })}>
                                        <i className="text-muted fas fa-play-circle fa-1p5x"></i>
                                        <span className="position-absolute badge badge-success ticket-badge">{processingCount > 99 ? '99+' : processingCount}</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" delay={0} target="processingFilter">處理中</UncontrolledTooltip>

                                    <Button color="light" id="resolvedFilter"
                                        className={this.state.statusFilter === STATUS_TYPES.RESOLVED ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.RESOLVED })}>
                                        <i className="text-muted fas fa-check-circle fa-1p5x"></i>
                                        <span className="position-absolute badge badge-success ticket-badge">{resolvedCount > 99 ? '99+' : resolvedCount}</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" delay={0} target="resolvedFilter">已處理</UncontrolledTooltip>

                                    <Button color="light" id="closedFilter"
                                        className={this.state.statusFilter === STATUS_TYPES.CLOSED ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.CLOSED })}>
                                        <i className="text-muted fas fa-minus-circle fa-1p5x"></i>
                                        <span className="position-absolute badge badge-success ticket-badge">{closedCount > 99 ? '99+' : closedCount}</span>
                                    </Button>
                                    <UncontrolledTooltip placement="top" delay={0} target="closedFilter">已關閉</UncontrolledTooltip>
                                </ButtonGroup>

                                <div className="d-flex align-items-center w-25 mx-0 search">
                                    <input className="search-box"
                                        type="text"
                                        placeholder={this.props.t('Search')}
                                        value={this.state.searchKeyword}
                                        onChange={this.keywordChanged} />
                                </div>

                                <Button size="sm" className="ticket-insert" color="light" onClick={this.openInsertModal}>
                                    <i className="fas fa-plus fa-fw"></i>
                                </Button>
                            </div>

                            <AppsSelector className="mx-4 mb-3 px-3" onChange={this.appChanged} />

                            {this.state.appId &&
                            <TicketContent className="mx-4"
                                appId={appId}
                                appsAgents={this.state.appsAgents}
                                searchKeyword={this.state.searchKeyword}
                                statusFilter={this.state.statusFilter}>
                            </TicketContent>}
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.isInsertModalOpen &&
                <TicketInsertModal
                    isOpen={this.state.isInsertModalOpen}
                    apps={this.props.apps}
                    appsAgents={this.state.appsAgents}
                    appsChatrooms={this.props.appsChatrooms}
                    consumers={this.props.consumers}
                    close={this.closeInsertModal}>
                </TicketInsertModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Tickets)));