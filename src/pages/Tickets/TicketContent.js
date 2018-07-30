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
import { notify } from '../../components/Notify/Notify';

import defaultAvatar from '../../image/defautlt-avatar.png';
import logoSmall from '../../image/logo-small.png';

const RESOLVED = 4;
const CLOSED = 5;

class TicketContent extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        searchKeyword: PropTypes.string,
        statusFilter: PropTypes.number,
        appsAgents: PropTypes.object,
        appId: PropTypes.string,
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

        this.noTicketsElem = (
            <div className="w-100 text-center">
                <div className="mx-auto image-container" style={{ width: '8rem', height: '8rem' }}>
                    <img className="w-100 h-100 p-2" src={logoSmall} alt="" />
                </div>
                <h5>無待辦事項</h5>
            </div>
        );

        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.doneTicket = this.doneTicket.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
    }

    openEditModal(appId, ticketId) {
        /** @type {Chatshier.Model.AppsTickets} */
        let appsTickets = this.props.appsTickets;
        let ticket = appsTickets[appId].tickets[ticketId];
        /** @type {Chatshier.Model.Consumers} */
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

    doneTicket(appId, ticketId) {
        return apiDatabase.appsTickets.update(appId, ticketId, { status: RESOLVED });
    }

    deleteTicket(appId, ticketId) {
        if (!window.confirm('確定要刪除嗎？')) {
            return;
        }

        return apiDatabase.appsTickets.delete(appId, ticketId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    render() {
        /** @type {Chatshier.Model.AppsTickets} */
        let appsTickets = this.props.appsTickets;

        let appId = this.props.appId;
        let tickets = appsTickets[appId] ? appsTickets[appId].tickets || {} : {};
        if (0 === Object.keys(tickets).length) {
            return this.noTicketsElem;
        }

        let appsAgents = this.props.appsAgents;
        let agents = appsAgents[appId] ? appsAgents[appId].agents || {} : {};

        // 根據優先度排序待辦事項，由高至低
        // 過期的優先拉致前頭
        let dateNow = Date.now();
        let ticketIds = Object.keys(tickets).sort((a, b) => {
            let isDueA = (new Date(tickets[a].dueTime).getTime() > dateNow);
            let isDueB = (new Date(tickets[b].dueTime).getTime() > dateNow);
            let isPriorityHigh = tickets[a].priority < tickets[b].priority;
            if (isDueA && !isDueB) {
                return 1;
            } else if (isDueB && !isDueA) {
                return -1;
            }
            return isPriorityHigh ? 1 : -1;
        });

        /** @type {Chatshier.Model.Consumers} */
        let consumers = this.props.consumers;
        let ticketElems = [];

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
                    <Card className="ticket-card shadow animated fadeIn" body>
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
                            {(ticket.status !== RESOLVED && ticket.ticket !== CLOSED) &&
                            <Aux>
                                <Button className="w-100 mr-1" color="light" id={'ticketDoneBtn_' + ticketId} onClick={() => this.doneTicket(appId, ticketId)}>
                                    <i className="fas fa-user-check text-muted"></i>
                                </Button>
                                <UncontrolledTooltip placement="top" delay={0} target={'ticketDoneBtn_' + ticketId}>已完成</UncontrolledTooltip>
                            </Aux>}

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

        return (
            <Aux>
                <CardGroup className={this.props.className.trim()}>
                    {ticketElems.length > 0 ? ticketElems : this.noTicketsElem}
                </CardGroup>

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
    return Object.assign({}, ownProps, {
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers
    });
};

export default connect(mapStateToProps)(TicketContent);
