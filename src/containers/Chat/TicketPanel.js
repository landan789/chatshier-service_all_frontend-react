import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';

import { toPriorityColor, toStatusText } from '../../utils/ticket';
import { formatDate } from '../../utils/unitTime';

import TicketInsertModal from '../../components/Modals/TicketInsert/TicketInsert';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';
import { findChatroomMessager } from './Chat';

import './TicketPanel.css';

const CHATSHIER = 'CHATSHIER';

class TicketPanel extends React.Component {
    static propTypes = {
        appId: PropTypes.string.isRequired,
        chatroomId: PropTypes.string.isRequired,
        apps: PropTypes.object,
        appsChatrooms: PropTypes.object,
        appsTickets: PropTypes.object,
        consumers: PropTypes.object,
        users: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.App} */
        this.app = void 0;
        /** @type {Chatshier.Chatroom} */
        this.chatroom = void 0;

        this.state = {
            isInsertModalOpen: false,
            editModalData: null
        };

        this.appsAgents = {};
        this.createAppsAgents(this.props);

        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.createAppsAgents(props);
    }

    createAppsAgents(props) {
        let apps = props.apps;
        let groups = props.groups;

        for (let appId in apps) {
            // 準備各個 app 的指派人清單
            // 由於每個 app 可能隸屬於不同的群組
            // 因此指派人清單必須根據 app 所屬的群組分別建立清單
            this.appsAgents[appId] = { agents: {} };
            for (let groupId in groups) {
                let group = groups[groupId];
                if (0 <= group.app_ids.indexOf(appId)) {
                    for (let memberId in group.members) {
                        let memberUserId = group.members[memberId].user_id;
                        this.appsAgents[appId].agents[memberUserId] = {
                            name: this.props.users[memberUserId].name,
                            email: this.props.users[memberUserId].email
                        };
                    }
                }
            }
        }
    }

    openInsertModal(ev) {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal(ev) {
        this.setState({ isInsertModalOpen: false });
    }

    openEditModal(ev, appId, ticketId) {
        /** @type {Chatshier.Ticket} */
        let ticket = this.props.appsTickets[appId].tickets[ticketId];
        /** @type {Chatshier.Consumer} */
        let consumer = this.props.consumers[ticket.platformUid];

        this.setState({
            editModalData: {
                appId: appId,
                ticketId: ticketId,
                ticket: ticket,
                consumer: consumer
            }
        });
    }

    closeEditModal(ev) {
        this.setState({ editModalData: null });
    }

    render() {
        let appId = this.props.appId;
        let chatroomId = this.props.chatroomId;

        this.app = this.props.apps[appId];
        if (!this.app || (this.app && CHATSHIER === this.app.type)) {
            return null;
        }

        this.chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
        if (!this.chatroom) {
            return null;
        }

        // 屬於群組聊天室的話，沒有待辦事項的功能
        let isGroupChatroom = CHATSHIER === this.app.type || !!this.chatroom.platformGroupId;
        if (isGroupChatroom) {
            return null;
        }

        let platformMessager = findChatroomMessager(this.chatroom.messagers, this.app.type);
        let platformUid = platformMessager.platformUid;
        let tickets = this.props.appsTickets[appId] ? this.props.appsTickets[appId].tickets : {};
        let ticketIds = Object.keys(tickets).filter((ticketId) => {
            // 只顯示未刪除、對象是此客戶以及有被指派的待辦事項
            return !!(
                !tickets[ticketId].isDeleted &&
                platformUid === tickets[ticketId].platformUid &&
                tickets[ticketId].assigned_id
            );
        });

        return (
            <Aux>
                <div className="ticket-panel col px-0 animated slideInRight">
                    <div className="ticket-wrapper p-2">
                        <div className="m-0 p-0 person-ticket ticket-group animated fadeIn">
                            <table className="ticket-table">
                                <thead>
                                    <tr>
                                        <th className="sortable">狀態</th>
                                        <th className="sortable">到期</th>
                                        <th>
                                            <input type="text" className="w-100 ticket-search-bar" placeholder="搜尋" />
                                        </th>
                                        <th className="chsr">
                                            <span className="modal-toggler ticket-add" onClick={this.openInsertModal}>
                                                <i className="fas fa-plus fa-fw"></i>
                                                <span>新增待辦</span>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="ticket-body">
                                    {ticketIds.map((ticketId) => (
                                        <tr key={ticketId} className="ticket-row" onClick={(ev) => this.openEditModal(ev, appId, ticketId)}>
                                            <td className="status" style={{ borderLeft: '.3rem solid ' + toPriorityColor(tickets[ticketId].priority) }}>
                                                {toStatusText(tickets[ticketId].status)}
                                            </td>
                                            <td>{formatDate(new Date(tickets[ticketId].dueTime))}</td>
                                            <td className="ticket-description">{tickets[ticketId].description}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {this.state.isInsertModalOpen &&
                <TicketInsertModal
                    isOpen={this.state.isInsertModalOpen}
                    appId={appId}
                    chatroomId={chatroomId}
                    platformUid={platformUid}
                    apps={this.props.apps}
                    appsAgents={this.appsAgents}
                    appsChatrooms={this.props.appsChatrooms}
                    consumers={this.props.consumers}
                    close={this.closeInsertModal}>
                </TicketInsertModal>}

                {!!this.state.editModalData && <TicketEditModal
                    appId={appId}
                    appsAgents={this.appsAgents}
                    appsChatrooms={this.props.appsChatrooms}
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </TicketEditModal>}
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

export default connect(mapStateToProps)(TicketPanel);
