import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Col, CardGroup, Card, CardText,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

import { toDueDateSpan, toPriorityColor,
    toPriorityText, toStatusText } from '../../utils/ticket';
import { formatDate, formatTime } from '../../utils/unitTime';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';

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

                if (!(platformUid && consumers[platformUid]) ||
                    (this.props.statusFilter && ticket.status !== this.props.statusFilter)) {
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
                                    <img className="m-2 consumer-avatar small" src={consumer.photo} alt="" />
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
                            <Button onClick={() => this.openEditModal(appId, ticketId)}>編輯</Button>
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
