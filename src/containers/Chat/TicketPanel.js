import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
            return;
        }
        return (
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
                                        <span className="modal-toggler ticket-add" >
                                            <i className="fas fa-plus fa-fw"></i>
                                            <span>新增待辦</span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="ticket-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    };
};

export default connect(mapStateToProps)(TicketPanel);
