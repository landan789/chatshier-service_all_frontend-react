import socketClient from 'socket.io-client';
import SOCKET_EVENTS from '../config/socket-events';
import CHATSHIER from '../config/chatshier';

import authHelper from './authentication';
import mainStore from '../redux/mainStore';
import { updateChatrooms, updateChatroomsMessagers, updateChatroomsMessages } from '../redux/actions/mainStore/appsChatrooms';
import { updateConsumers } from '../redux/actions/mainStore/consumers';

const SOCKET_NAMESPACE = '/chatshier';
const WAIT_TIMEOUT = 3000;

class SocketHelper {
    constructor() {
        /** @type {Function} */
        this._connectionReadyResolve = null;
        this.connectionReady = new Promise((resolve) => {
            this._connectionReadyResolve = resolve;
        });
    }

    get isConnected() {
        return !!this.socket;
    }

    connect() {
        return Promise.resolve().then(() => {
            if (this.socket) {
                return this.disconnect();
            }
        }).then(() => {
            let URL = CHATSHIER.URL;
            this.socket = socketClient.connect(URL.API + SOCKET_NAMESPACE);
            return new Promise((resolve) => {
                this.socket.once('connect', () => {
                    console.info('=== socket connected ===');
                    this._connectionReadyResolve();
                    delete this._connectionReadyResolve;
                    resolve();
                });
            });
        }).then(() => {
            return this.userRegistration();
        }).then(() => {
            this._bindingSocketEvents(this.socket);
        });
    }

    disconnect() {
        return new Promise((resolve) => this.socket.close(resolve));
    }

    sendMessageToServer(socketBody) {
        socketBody = socketBody || {};
        return this._send(SOCKET_EVENTS.EMIT_MESSAGE_TO_SERVER, socketBody);
    }

    updateMessagerToServer(socketBody) {
        socketBody = socketBody || {};
        return this._send(SOCKET_EVENTS.UPDATE_MESSAGER_TO_SERVER, socketBody);
    }

    /**
     * @param {string} appId
     * @param {string} chatroomId
     */
    readChatroomUnRead(appId, chatroomId) {
        let socketBody = {
            appId: appId,
            chatroomId: chatroomId,
            userId: authHelper.userId
        };
        return this._send(SOCKET_EVENTS.READ_CHATROOM_MESSAGES, socketBody);
    }

    userRegistration() {
        return new Promise((resolve) => {
            this.socket.emit(SOCKET_EVENTS.USER_REGISTRATION, authHelper.userId, resolve);
        });
    }

    /**
     * @param {string} eventName
     * @param {any} socketBody
     */
    _send(eventName, socketBody) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject(new Error('socket not connected'));
            }

            let waitTimer = window.setTimeout(() => {
                reject(new Error('socket was timeout'));
            }, WAIT_TIMEOUT);

            this.socket.emit(eventName, socketBody, (err) => {
                window.clearTimeout(waitTimer);
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve();
            });
        });
    }

    _bindingSocketEvents() {
        let _this = this;
        (function keepConnection() {
            return new Promise((resolve) => {
                _this.socket.once(SOCKET_EVENTS.DISCONNECT, resolve);
            }).then(() => {
                console.info('=== socket disconnected ===');
                _this.connectionReady = new Promise((resolve) => {
                    _this._connectionReadyResolve = resolve;
                });
                return new Promise((resolve) => {
                    _this.socket.once(SOCKET_EVENTS.RECONNECT, resolve);
                });
            }).then(() => {
                console.info('=== socket reconnected ===');
                _this._connectionReadyResolve();
                delete _this._connectionReadyResolve;
                return _this.userRegistration();
            }).then(() => {
                return keepConnection();
            });
        })();

        this.socket.on(SOCKET_EVENTS.EMIT_MESSAGE_TO_CLIENT, (data) => {
            /** @type {ChatshierChatSocketBody} */
            let socketBody = data;

            let appId = socketBody.app_id;
            let chatroomId = socketBody.chatroom_id;
            /** @type {Chatshier.Model.ChatroomMessage[]} */
            let messages = socketBody.messages;
            let chatroomFromSocket = socketBody.chatroom;
            let consumersFromSocket = socketBody.consumers;

            // 根據發送的時間從早到晚排序
            messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

            if (consumersFromSocket) {
                mainStore.dispatch(updateConsumers(consumersFromSocket));
            }

            if (chatroomFromSocket) {
                let appsChatrooms = {
                    [appId]: {
                        chatrooms: {
                            [chatroomId]: chatroomFromSocket
                        }
                    }
                };
                mainStore.dispatch(updateChatrooms(appsChatrooms));
            }

            let messagesFromSocket = messages.reduce((output, message) => {
                output[message._id] = message;
                return output;
            }, {});
            mainStore.dispatch(updateChatroomsMessages(appId, chatroomId, messagesFromSocket));
        });

        this.socket.on(SOCKET_EVENTS.UPDATE_MESSAGER_TO_CLIENT, (data) => {
            let appId = data.appId;
            let chatroomId = data.chatroomId;
            let messager = data.messager;

            let messagersFromSocket = {
                [messager._id]: messager
            };
            mainStore.dispatch(updateChatroomsMessagers(appId, chatroomId, messagersFromSocket));
        });
    }
}

export default new SocketHelper();
