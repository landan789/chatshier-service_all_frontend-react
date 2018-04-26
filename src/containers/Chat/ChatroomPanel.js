import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import authHelper from '../../helpers/authentication';
import { MINUTE } from '../../utils/unitTime';

import Message from './Message';

const CHATSHIER = 'CHATSHIER';
const SYSTEM = 'SYSTEM';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class ChatroomPanel extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.prevTime = 0;
        this.nowDateStr = '';
    }

    render() {
        let props = this.props;
        if (!(props.isOpen && props.appId && props.chatroomId)) {
            return null;
        }
        this.prevTime = 0;
        this.nowDateStr = '';

        let app = props.apps[props.appId];
        let chatroom = props.appsChatrooms[props.appId].chatrooms[props.chatroomId];
        let messagers = chatroom.messagers;
        let messages = chatroom.messages;
        let userId = authHelper.userId;

        let className = ((this.props.className || '') + ' chatroom-panel').trim();
        let messageIds = Object.keys(messages);
        // 根據發送的時間從早到晚排序
        messageIds.sort((a, b) => new Date(messages[a].time).getTime() - new Date(messages[b].time).getTime());

        return (
            <div className={className}>
                <div className="w-100 chatroom-body">
                    <div className="chat-content">
                        <div className="h-100 d-flex flex-column message-panel">
                            {messageIds.length < 10 && <p className="message-time font-weight-bold">-沒有更舊的歷史訊息-</p>}
                            {messageIds.map((messageId) => {
                                let message = messages[messageId];
                                let messagerId = message.messager_id;
                                let messager = messagers[messagerId];
                                let platformUid = '';
                                let sender = {};
                                if (messagerId && SYSTEM !== message.from) {
                                    platformUid = messager.platformUid;
                                    sender = CHATSHIER === messager.type ? props.users[platformUid] : props.consumers[platformUid];
                                }
                                let senderName = SYSTEM === message.from ? '由系統發送' : (sender.name || '');
                                let isMedia = 'image' === message.type || 'audio' === message.type || 'video' === message.type;

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
                        <input className="submit-message-input px-2" type="text" placeholder="輸入訊息..." />
                        <i className="submit-message-btn p-0 ml-2"></i>
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

ChatroomPanel.propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    appId: PropTypes.string,
    chatroomId: PropTypes.string,
    apps: PropTypes.object,
    appsChatrooms: PropTypes.object,
    consumers: PropTypes.object,
    users: PropTypes.object
};

export default ChatroomPanel;
