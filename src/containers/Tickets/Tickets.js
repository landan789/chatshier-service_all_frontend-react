import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card, ButtonGroup, Button } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
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

    constructor(props) {
        super(props);

        this.state = {
            statusFilter: STATUS_TYPES.NONE,
            isInsertModalOpen: false,
            searchKeyword: '',
            appsAgents: {}
        };

        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle(this.props.t('To-Do items'));

        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsChatrooms.find(userId),
            apiDatabase.appsTickets.find(null, userId),
            apiDatabase.consumers.find(userId),
            apiDatabase.groups.find(userId),
            apiDatabase.users.find(userId)
        ]).then((resJsons) => {
            // 每個 app 因群組不同，指派人清單也會不同，因此須根據群組準備指派人清單
            let appsTickets = resJsons[2].data;
            let groups = resJsons[4].data;
            let users = resJsons[5].data;

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
                <PageWrapper toolbarTitle={this.props.t('To-Do items')}>
                    <Fade in className="mt-5 container ticket-wrapper">
                        <Card className="pb-5 chsr">
                            <div className="mx-4 px-3 ticket-toolbar">
                                <ButtonGroup className="mr-auto">
                                    <Button color="info"
                                        className={this.state.statusFilter === STATUS_TYPES.NONE ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.NONE })}>
                                        <i className="fas fa-list-alt fa-1p5x"></i>
                                    </Button>
                                    <Button color="info"
                                        className={this.state.statusFilter === STATUS_TYPES.PENDING ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.PENDING })}>
                                        <i className="fas fa-times-circle fa-1p5x"></i>
                                    </Button>
                                    <Button color="info"
                                        className={this.state.statusFilter === STATUS_TYPES.PROCESSING ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.PROCESSING })}>
                                        <i className="fas fa-play-circle fa-1p5x"></i>
                                    </Button>
                                    <Button color="info"
                                        className={this.state.statusFilter === STATUS_TYPES.RESOLVED ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.RESOLVED })}>
                                        <i className="fas fa-minus-circle fa-1p5x"></i>
                                    </Button>
                                    <Button color="info"
                                        className={this.state.statusFilter === STATUS_TYPES.CLOSED ? 'active' : ''}
                                        onClick={() => this.setState({ statusFilter: STATUS_TYPES.CLOSED })}>
                                        <i className="fas fa-check-circle fa-1p5x"></i>
                                    </Button>
                                </ButtonGroup>

                                <Button className="ticket-insert" color="light" onClick={this.openInsertModal}>
                                    <span className="fas fa-plus fa-fw"></span>
                                    <span><Trans i18nKey="Add To-Do item" /></span>
                                </Button>

                                <div className="d-flex align-items-center w-25 mx-0 search">
                                    <input className="search-box"
                                        type="text"
                                        placeholder={this.props.t('Search')}
                                        value={this.state.searchKeyword}
                                        onChange={this.keywordChanged} />
                                </div>
                            </div>

                            <TicketContent className="mx-4"
                                appsAgents={this.state.appsAgents}
                                searchKeyword={this.state.searchKeyword}
                                statusFilter={this.state.statusFilter}>
                            </TicketContent>
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
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    };
};

export default withRouter(withTranslate(connect(mapStateToProps)(Tickets)));
