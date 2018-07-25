import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Col, CardGroup, Card, CardText,
    CardTitle, CardSubtitle, Button, UncontrolledTooltip } from 'reactstrap';

import { toDueDateSpan, toPriorityColor,
    toPriorityText, toStatusText } from '../../utils/ticket';
import { formatDate, formatTime } from '../../utils/unitTime';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';
import apiDatabase from '../../helpers/apiDatabase/index';
import authHelper from '../../helpers/authentication';
import { notify } from '../../components/Notify/Notify';

import defaultAvatar from '../../image/defautlt-avatar.png';

const RESOLVED = 4;
const CLOSED = 5;

class TicketContent extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        searchKeyword: PropTypes.string,
        statusFilter: PropTypes.number,
        appsAgents: PropTypes.object,
        appsTickets: PropTypes.object.isRequired,
        consumers: PropTypes.object.isRequired
    }

    static defaultProps = {
        className: '',
        searchKeyword: ''
    }

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
        /** @type {Chatshier.Consumers} */
        let consumers = this.props.consumers;
        let consumer = consumers[ticket.platformUid];

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

    deleteTicket(appId, ticketId) {
        if (!window.confirm('確定要刪除嗎？')) {
            return;
        }
        let userId = authHelper.userId;

        return apiDatabase.appsTickets.delete(appId, ticketId, userId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    render() {
        /** @type {Chatshier.AppsTickets} */
        let appsTickets = this.props.appsTickets;
        /** @type {Chatshier.Consumers} */
        let consumers = this.props.consumers;
        let appsAgents = this.props.appsAgents;

        let ticketElems = [];
        let dateNow = Date.now();
        for (let appId in appsTickets) {
            if (!(appsTickets[appId] && appsAgents[appId])) {
                continue;
            }

            let agents = appsAgents[appId].agents;
            let tickets = appsTickets[appId].tickets;

            // 根據優先度排序待辦事項，由高至低
            // 過期的優先拉致前頭
            let ticketIds = Object.keys(tickets).sort((a, b) => {
                let isDueA = (new Date(tickets[a].dueTime).getTime() > dateNow);
                let isDueB = (new Date(tickets[b].dueTime).getTime() > dateNow);
                let isPriorityHigh = tickets[a].priority < tickets[b].priority;
                if (isDueA && !isDueB) {
                    return true;
                } else if (isDueB && !isDueA) {
                    return false;
                }
                return isPriorityHigh;
            });

            for (let i in ticketIds) {
                let ticketId = ticketIds[i];
                let ticket = tickets[ticketId];
                let platformUid = ticket.platformUid;

                // 當以下條件成立時，不顯示此筆待辦事項
                // 1. 此待辦事項指派的 consumer 不存在
                // 2. 當有設定狀態過濾時，不是指定狀態的待辦事項
                // 3. 當沒有設定狀態過濾時，待辦事項狀態為已解決或已關閉
                let shouldSkip =
                    !(platformUid && consumers[platformUid]) ||
                    (this.props.statusFilter && ticket.status !== this.props.statusFilter) ||
                    (!this.props.statusFilter && (ticket.status === RESOLVED || ticket.status === CLOSED));
                if (shouldSkip) {
                    continue;
                }

                let consumer = consumers[platformUid];
                let description = ticket.description;
                let statusText = toStatusText(ticket.status);
                let priorityText = toPriorityText(ticket.priority);
                let dueTimeStr = formatDate(ticket.dueTime) + ' ' + formatTime(ticket.dueTime, false);
                let dueDateElem = toDueDateSpan(ticket.dueTime);
                let agentName = ticket.assigned_id ? agents[ticket.assigned_id].name : '';

                let shouldShow = true;
                let searchKeyword = this.props.searchKeyword;
                if (searchKeyword) {
                    // 如果有輸入搜尋文字時，有包含在要顯示的文字中時才顯示
                    // 否則此欄位資料就不加入渲染的陣列中
                    shouldShow &= (
                        (consumer && consumer.name.includes(searchKeyword)) ||
                        agentName.includes(searchKeyword) ||
                        description.includes(searchKeyword) ||
                        statusText.includes(searchKeyword) ||
                        priorityText.includes(searchKeyword) ||
                        dueTimeStr.includes(searchKeyword) ||
                        dueDateElem.props.children.includes(searchKeyword)
                    );
                }

                shouldShow && ticketElems.push(
                    <Col key={ticketId} className="my-2" md="12" lg="4">
                        <Card className="ticket-card animated fadeIn" body>
                            <CardTitle>{dueDateElem}</CardTitle>
                            <CardSubtitle>
                                <div className="my-2 d-flex align-items-center">
                                    <div className="mr-1 card-label">客戶姓名:</div>
                                    <img className="my-2 mr-2 consumer-avatar small" src={consumer.photo || defaultAvatar} alt="" />
                                    <span className="ticket-value">{consumer.name || ''}</span>
                                </div>
                                <div className="my-2 d-flex align-items-center">
                                    <div className="mr-1 card-label">狀態:</div>
                                    <span className="ticket-value">{statusText}</span>
                                </div>
                                <div className="my-2 d-flex align-items-center">
                                    <div className="mr-1 card-label">優先度:</div>
                                    <span className="ticket-value">{priorityText}</span>
                                    <span className="ml-1 priority-circle" style={{ backgroundColor: toPriorityColor(ticket.priority) }}></span>
                                </div>
                                <div className="my-2 d-flex align-items-center">
                                    <div className="mr-1 card-label">到期時間:</div>
                                    <span className="ticket-value">{dueTimeStr}</span>
                                </div>
                                <div className="my-2 d-flex align-items-center">
                                    <div className="mr-1 card-label">指派人:</div>
                                    <span className="ticket-value">{agentName || '無'}</span>
                                </div>
                            </CardSubtitle>

                            <CardText className="d-flex align-items-center">
                                <span className="mr-1 card-label">內容:</span>
                                <span className="ticket-value">{description}</span>
                            </CardText>

                            <div className="d-flex w-100 buttons-container">
                                <Button className="w-100 mr-1" color="light" id={'ticketEditBtn_' + ticketId} onClick={() => this.openEditModal(appId, ticketId)}>
                                    <i className="fas fa-edit text-muted"></i>
                                </Button>
                                <UncontrolledTooltip placement="top" delay={0} target={'ticketEditBtn_' + ticketId}>編輯</UncontrolledTooltip>

                                <Button className="w-100" color="light" id={'ticketDeleteBtn_' + ticketId} onClick={() => this.deleteTicket(appId, ticketId)}>
                                    <i className="fas fa-trash-alt text-muted"></i>
                                </Button>
                                <UncontrolledTooltip placement="top" delay={0} target={'ticketDeleteBtn_' + ticketId}>刪除</UncontrolledTooltip>
                            </div>
                        </Card>
                    </Col>
                );
            }
        }

        return (
            <Aux>
                <CardGroup className={this.props.className.trim()}>{ticketElems}</CardGroup>

                {!!this.state.editModalData &&
                <TicketEditModal
                    appsAgents={this.props.appsAgents}
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
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers
    };
};

export default connect(mapStateToProps)(TicketContent);
