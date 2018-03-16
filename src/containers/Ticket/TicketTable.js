import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';

import { toDueDateSpan, toLocalTimeString, toPriorityBorder,
    toPriorityText, toStatusText } from '../../utils/ticket';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';

class TicketTable extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            editModalData: null
        };
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    openEditModal(appId, ticketId) {
        /** @type {Chatshier.AppsTickets} */
        let appsTickets = this.props.appsTickets;
        let ticket = appsTickets[appId].tickets[ticketId];
        /** @type {Chatshier.AppsMessagers} */
        let appsMessagers = this.props.appsMessagers;
        let messager = appsMessagers[appId].messagers[ticket.messager_id];

        this.setState({
            editModalData: {
                appId: appId,
                ticketId: ticketId,
                ticket: ticket,
                messager: messager
            }
        });
    }

    closeEditModal(ev) {
        this.setState({ editModalData: null });
    }

    renderTickets() {
        /** @type {Chatshier.AppsTickets} */
        let appsTickets = this.props.appsTickets;
        /** @type {Chatshier.AppsMessagers} */
        let appsMessagers = this.props.appsMessagers;
        if (!(appsTickets && appsMessagers)) {
            return;
        }

        let ticketCmps = [];
        for (let appId in appsTickets) {
            if (!(appsTickets[appId] && appsMessagers[appId])) {
                continue;
            }

            let tickets = appsTickets[appId].tickets;
            for (let ticketId in tickets) {
                let ticket = tickets[ticketId];
                let messagerId = ticket.messager_id;
                let messager = appsMessagers[appId].messagers[messagerId];

                let description = ticket.description.substring(0, 10);
                let statusText = toStatusText(ticket.status);
                let priorityText = toPriorityText(ticket.priority);
                let localTimeStr = toLocalTimeString(ticket.dueTime);
                let dueDateElem = toDueDateSpan(ticket.dueTime);

                let shouldShow = true;
                let searchKeyword = this.props.searchKeyword;
                if (searchKeyword) {
                    // 如果有輸入搜尋文字時，有包含在要顯示的文字中時才顯示
                    // 否則此欄位資料就不加入渲染的陣列中
                    shouldShow &= (
                        description.includes(searchKeyword) ||
                        statusText.includes(searchKeyword) ||
                        priorityText.includes(searchKeyword) ||
                        localTimeStr.includes(searchKeyword) ||
                        dueDateElem.props.children.includes(searchKeyword)
                    );
                }

                shouldShow && ticketCmps.push(
                    <div key={ticketId} className="ticket-row d-flex"
                        style={toPriorityBorder(ticket.priority)}
                        onClick={() => this.openEditModal(appId, ticketId)}>
                        <div className="ticket-col">{messager.name || ''}</div>
                        <div className="ticket-col">{description}</div>
                        <div className="ticket-col">{statusText}</div>
                        <div className="ticket-col">{priorityText}</div>
                        <div className="ticket-col">{localTimeStr}</div>
                        <div className="ticket-col">{dueDateElem}</div>
                    </div>
                );
            }
        }

        if (ticketCmps.length <= 0) {
            return ticketCmps;
        }
        return <div className="ticket-body">{ticketCmps}</div>;
    };

    render() {
        return (
            <Aux>
                <div className="ticket-grid">
                    <div className="ticket-head">
                        <div className="ticket-row d-flex">
                            <div className="ticket-col">客戶姓名</div>
                            <div className="ticket-col">內容</div>
                            <div className="ticket-col">狀態</div>
                            <div className="ticket-col">優先</div>
                            <div className="ticket-col">到期時間</div>
                            <div className="ticket-col">&nbsp;</div>
                        </div>
                    </div>
                    {this.renderTickets()}
                </div>
                <TicketEditModal
                    editModalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </TicketEditModal>
            </Aux>
        );
    }
}

TicketTable.propTypes = {
    searchKeyword: PropTypes.string,
    appsMessagers: PropTypes.object.isRequired,
    appsTickets: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsMessagers: state.appsMessagers,
        appsTickets: state.appsTickets
    };
};

export default connect(mapStateToProps)(TicketTable);
