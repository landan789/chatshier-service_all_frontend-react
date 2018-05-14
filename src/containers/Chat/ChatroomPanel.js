import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import authHelper from '../../helpers/authentication';
import socketHelper from '../../helpers/socket';
import { MINUTE } from '../../utils/unitTime';

import { findChatroomMessager, findMessagerSelf } from './Chat';
import Message from './Message';

import sendBtnSvg from '../../image/send-btn.svg';
import './ChatroomPanel.css';

const CHATSHIER = 'CHATSHIER';
const SYSTEM = 'SYSTEM';
const VENDOR = 'VENDOR';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class ChatroomPanel extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        appId: PropTypes.string,
        chatroomId: PropTypes.string,
        apps: PropTypes.object,
        appsChatrooms: PropTypes.object,
        consumers: PropTypes.object,
        users: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.prevTime = 0;
        this.nowDateStr = '';

        this.state = {
            messageText: ''
        };

        /** @type {HTMLElement} */
        this.messagePanelElem = null;

        this.onMessageChange = this.onMessageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        return new Promise((resolve) => {
            window.setTimeout(resolve, 1);
        }).then(() => {
            this.scrollToBottom();
        });
    }

    scrollToBottom() {
        this.messagePanelElem && this.messagePanelElem.scrollTo({
            top: this.messagePanelElem.scrollHeight,
            behavior: 'instant'
        });
    }

    /**
     * @param {KeyboardEvent} ev
     **/
    onMessageChange(ev) {
        this.setState({ messageText: ev.target.value });
    }

    sendMessage() {
        let messageText = this.state.messageText;
        let appId = this.props.appId;
        /** @type {Chatshier.App} */
        let app = this.props.apps[appId];

        let chatroomId = this.props.chatroomId;
        let chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
        let platformMessager = findChatroomMessager(chatroom.messagers, app.type);
        let messagerSelf = findMessagerSelf(chatroom.messagers);
        let userId = authHelper.userId;

        /** @type {ChatshierMessage} */
        let messageToSend = {
            from: CHATSHIER,
            time: Date.now(),
            text: messageText,
            src: '',
            type: 'text',
            messager_id: messagerSelf._id
        };

        /** @type {ChatshierChatSocketBody} */
        let socketBody = {
            app_id: appId,
            type: app.type,
            chatroom_id: chatroomId,
            senderUid: userId,
            recipientUid: platformMessager.platformUid,
            messages: [messageToSend]
        };

        this.setState({ messageText: '' });
        return socketHelper.sendMessageToServer(socketBody);
    }

    render() {
        let props = this.props;
        if (!(props.appId && props.chatroomId)) {
            return null;
        }
        this.prevTime = 0;
        this.nowDateStr = '';

        let app = props.apps[props.appId];
        let chatroom = props.appsChatrooms[props.appId].chatrooms[props.chatroomId];
        let messagers = chatroom.messagers;
        let messages = chatroom.messages;
        let userId = authHelper.userId;

        let messagerSelf = findMessagerSelf(messagers);
        let className = (this.props.className || '') + ' chatroom-panel';
        let messageIds = Object.keys(messages);

        // 根據發送的時間從早到晚排序
        messageIds.sort((a, b) => new Date(messages[a].time).getTime() - new Date(messages[b].time).getTime());

        return (
            <div className={className.trim()}>
                <div className="w-100 chatroom-body">
                    <div className="chat-content">
                        <div className="h-100 d-flex flex-column message-panel" ref={(elem) => (this.messagePanelElem = elem)}>
                            {messageIds.length < 10 && <p className="message-time font-weight-bold">-沒有更舊的歷史訊息-</p>}
                            {messageIds.map((messageId) => {
                                let message = messages[messageId];
                                let messagerId = message.messager_id;
                                let messager = messagers[messagerId];

                                let platformUid = '';
                                let sender = {};

                                if (messagerId && messager && SYSTEM !== message.from) {
                                    platformUid = messager.platformUid;
                                    sender = CHATSHIER === messager.type ? props.users[platformUid] : props.consumers[platformUid];
                                }

                                let senderName = (messagerSelf && messagerSelf.namings && messagerSelf.namings[platformUid]) || (sender && sender.name) || '';
                                if (SYSTEM === message.from) {
                                    senderName = '由系統發送';
                                } else if (VENDOR === message.from) {
                                    senderName = '經由平台軟體發送';
                                }

                                let isMedia = (
                                    'image' === message.type ||
                                    'audio' === message.type ||
                                    'video' === message.type ||
                                    'sticker' === message.type ||
                                    'template' === message.type
                                );

                                // 如果訊息是來自於 Chatshier 或 系統自動回覆 的話，訊息一律放在右邊
                                // 如果訊息是來自於其他平台的話，訊息一律放在左邊
                                let shouldRightSide =
                                    (app.type !== CHATSHIER && (SYSTEM === message.from || CHATSHIER === message.from)) ||
                                    (app.type === CHATSHIER && userId === platformUid);

                                let messageDatetime = new Date(message.time);
                                let dateStr = messageDatetime.toDateString();
                                let dateStrSymbol = null;
                                if (dateStr !== this.nowDateStr) {
                                    this.nowDateStr = dateStr;
                                    dateStrSymbol = (
                                        <p className="message-time font-weight-bold">{this.nowDateStr}</p>
                                    );
                                }
                                let messageTime = messageDatetime.getTime();
                                let datetimeStrSymbol = null;
                                if (messageTime - this.prevTime > 15 * MINUTE) {
                                    datetimeStrSymbol = (
                                        <p className="message-time font-weight-bold">{this._toDateStr(messageTime)}</p>
                                    );
                                }
                                this.prevTime = messageTime;

                                return (
                                    <Aux key={messageId}>
                                        {dateStrSymbol}
                                        {datetimeStrSymbol}
                                        <Message
                                            shouldRightSide={shouldRightSide}
                                            senderName={senderName}
                                            isMedia={isMedia}
                                            messageType={message.type}
                                            messageText={message.text}
                                            messageSrc={message.src}
                                            messageTime={messageDatetime.getTime()}>
                                        </Message>
                                    </Aux>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-100 message-input-container">
                    <div className="d-flex align-items-center message-input form-upper">
                        <div className="media-container">
                            <button className="p-0 media-btn">
                                <i className="fas fa-image"></i>
                            </button>
                            <button className="p-0 media-btn">
                                <i className="fas fa-video"></i>
                            </button>
                            <button className="p-0 media-btn">
                                <i className="fa fa-volume-up"></i>
                            </button>
                            <input className="ghost-file d-none" type="file" accept="image/*" />
                            <input className="ghost-file d-none" type="file" accept="video/mp4,video/mpeg4" />
                            <input className="ghost-file d-none" type="file" accept="audio/mp3,video/mpeg3" />
                        </div>
                    </div>
                    <div className="message-input form-lower">
                        <input className="submit-message-input px-2" type="text"
                            placeholder="輸入訊息..."
                            value={this.state.messageText}
                            onChange={this.onMessageChange}
                            onKeyDown={(ev) => (13 === ev.keyCode) && this.sendMessage()} />
                        <img className="submit-message-btn p-0 ml-2" src={sendBtnSvg} alt="" onClick={this.sendMessage} />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * @param {number} inputTime
     */
    _toDateStr(inputTime) {
        let str = '';
        let date = new Date(inputTime);
        let addZero = (val) => val < 10 ? '0' + val : val;

        str += date.getFullYear() + '/' + addZero(date.getMonth() + 1) + '/' + addZero(date.getDate()) + ' ';
        str += WEEK[date.getDay()] + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
        return str;
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        consumers: storeState.consumers,
        users: storeState.users
    };
};

export default connect(mapStateToProps)(ChatroomPanel);
