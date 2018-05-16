import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import chatshierCfg from '../../config/chatshier';
import authHelper from '../../helpers/authentication';
import socketHelper from '../../helpers/socket';
import { MINUTE } from '../../utils/unitTime';

import { notify } from '../../components/Notify/Notify';
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
        searchKeyword: PropTypes.string,
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
            messageText: '',
            isProcessing: false
        };

        /** @type {{[type: string]: HTMLInputElement}} */
        this.fileSelectors = {};

        /** @type {HTMLElement} */
        this.messagePanelElem = null;

        this.onMessageChange = this.onMessageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
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

        /** @type {Chatshier.SocketMessage} */
        let messageToSend = {
            from: CHATSHIER,
            time: Date.now(),
            text: messageText,
            src: '',
            type: 'text',
            messager_id: messagerSelf._id
        };

        /** @type {Chatshier.SocketMessageBody} */
        let socketBody = {
            app_id: appId,
            type: app.type,
            chatroom_id: chatroomId,
            senderUid: userId,
            recipientUid: platformMessager.platformUid,
            messages: [messageToSend]
        };

        this.setState({ messageText: '', isProcessing: true });
        return socketHelper.sendMessageToServer(socketBody).then(() => {
            this.setState({ isProcessing: false });
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('發送失敗', { type: 'danger' });
        });
    }

    /**
     * @param {Event} ev
     */
    uploadFile(ev, messageType) {
        /** @type {HTMLInputElement} */
        let fileInput = ev.target;
        if (!fileInput.files.length) {
            fileInput.value = '';
            return;
        }

        /** @type {File} */
        let file = fileInput.files[0];
        fileInput.value = ''; // 把 input file 值清空，使 change 事件對同一檔案可重複觸發

        let FILE_MAXSIZE = chatshierCfg.FILE_MAXSIZE;
        let kiloByte = 1024;
        let megaByte = kiloByte * 1024;

        let isImage = file.type.indexOf('image') >= 0;
        isImage && (messageType = 'image');
        let isVideo = file.type.indexOf('video') >= 0;
        isVideo && (messageType = 'video');
        let isAudio = file.type.indexOf('audio') >= 0;
        isAudio && (messageType = 'audio');

        if (isImage && file.size > FILE_MAXSIZE.image) {
            return notify('圖像檔案過大，檔案大小限制為: ' + Math.floor(FILE_MAXSIZE.image / megaByte) + ' MB', { type: 'warning' });
        } else if (isVideo && file.size > FILE_MAXSIZE.video) {
            return notify('影像檔案過大，檔案大小限制為: ' + Math.floor(FILE_MAXSIZE.video / megaByte) + ' MB', { type: 'warning' });
        } else if (isAudio && file.size > FILE_MAXSIZE.audio) {
            return notify('聲音檔案過大，檔案大小限制為: ' + Math.floor(FILE_MAXSIZE.audio / megaByte) + ' MB', { type: 'warning' });
        } else if (file.size > FILE_MAXSIZE.other) {
            return notify('檔案過大，檔案大小限制為: ' + Math.floor(FILE_MAXSIZE.other / megaByte) + ' MB', { type: 'warning' });
        }

        let fileSize = file.size / kiloByte;
        if (fileSize >= 1000) {
            fileSize /= kiloByte;
            fileSize = fileSize.toFixed(1) + ' MB';
        } else {
            fileSize = fileSize.toFixed(1) + ' KB';
        }

        let appId = this.props.appId;
        let chatroomId = this.props.chatroomId;
        let userId = authHelper.userId;
        let app = this.props.apps[appId];
        let chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
        let messagerSelf = findMessagerSelf(chatroom.messagers);
        let platformMessager = findChatroomMessager(chatroom.messagers, app.type);

        /** @type {Chatshier.SocketMessage} */
        let messageToSend = {
            text: '錢掌櫃傳送檔案給您:\n檔案大小: ' + fileSize + '\n',
            src: file,
            fileName: file.name,
            type: messageType,
            from: CHATSHIER,
            time: Date.now(),
            messager_id: messagerSelf._id
        };

        /** @type {Chatshier.SocketMessageBody} */
        let socketBody = {
            app_id: appId,
            type: app.type,
            chatroom_id: chatroomId,
            senderUid: userId,
            recipientUid: platformMessager.platformUid,
            messages: [messageToSend]
        };

        this.setState({ isProcessing: true });
        return socketHelper.sendMessageToServer(socketBody).then(() => {
            this.setState({ isProcessing: false });
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify('發送失敗', { type: 'danger' });
        });
    }

    render() {
        let props = this.props;
        if (!(props.appId && props.chatroomId)) {
            return null;
        }

        let app = props.apps[props.appId];
        if (!app) {
            return null;
        }

        let chatroom = props.appsChatrooms[props.appId].chatrooms[props.chatroomId];
        if (!chatroom) {
            return null;
        }

        this.prevTime = 0;
        this.nowDateStr = '';

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
                                            message={message}
                                            messageTime={messageDatetime.getTime()}
                                            searchKeyword={this.props.searchKeyword}>
                                        </Message>
                                    </Aux>
                                );
                            })}
                            {this.state.isProcessing &&
                            <div className="mb-3 message">
                                <div className="ml-auto loading-container">
                                    <i className="fas fa-spinner fa-pulse fa-2x"></i>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>

                <div className="w-100 message-input-container">
                    <div className="d-flex align-items-center message-input form-upper">
                        <div className="media-container">
                            <button className="p-0 media-btn" onClick={() => this.fileSelectors.image.click()}>
                                <i className="fas fa-image"></i>
                            </button>
                            <button className="p-0 media-btn" onClick={() => this.fileSelectors.video.click()}>
                                <i className="fas fa-video"></i>
                            </button>
                            <button className="p-0 media-btn" onClick={() => this.fileSelectors.audio.click()}>
                                <i className="fa fa-volume-up"></i>
                            </button>
                            <button className="p-0 media-btn" onClick={() => this.fileSelectors.file.click()}>
                                <i className="fas fa-file"></i>
                            </button>

                            <input className="ghost-file d-none"
                                type="file"
                                accept="image/*"
                                ref={(elem) => (this.fileSelectors.image = elem)}
                                onChange={(ev) => this.uploadFile(ev, 'image')} />
                            <input className="ghost-file d-none"
                                type="file"
                                accept="video/mp4,video/mpeg4"
                                ref={(elem) => (this.fileSelectors.video = elem)}
                                onChange={(ev) => this.uploadFile(ev, 'video')} />
                            <input className="ghost-file d-none"
                                type="file"
                                accept="audio/mp3,video/mpeg3"
                                ref={(elem) => (this.fileSelectors.audio = elem)}
                                onChange={(ev) => this.uploadFile(ev, 'audio')} />
                            <input className="ghost-file d-none"
                                type="file"
                                accept="*/*"
                                ref={(elem) => (this.fileSelectors.file = elem)}
                                onChange={(ev) => this.uploadFile(ev, 'file')} />
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
