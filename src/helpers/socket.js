import socketClient from 'socket.io-client';
import SOCKET_EVENTS from '../config/socket-events';
import urlConfig from '../config/url';

import mainStore from '../redux/mainStore';
import { updateChatroomsMessagers, updateChatroomsMessages } from '../redux/actions/mainStore/appsChatrooms';
import { updateConsumers } from '../redux/actions/mainStore/consumers';

const SOCKET_NAMESPACE = '/chatshier';

class SocketHelper {
    constructor() {
        /** @type {Function} */
        this._connectionReadyResolve = null;
        this.connectionReady = new Promise((resolve) => {
            this._connectionReadyResolve = resolve;
        });
        this.connect();
    }

    connect() {
        return Promise.resolve().then(() => {
            if (this.socket) {
                return this.disconnect();
            }
        }).then(() => {
            this.socket = socketClient.connect(urlConfig.apiUrl + SOCKET_NAMESPACE);
            return new Promise((resolve) => {
                this.socket.once('connect', () => {
                    console.info('=== socket connected ===');
                    this._connectionReadyResolve();
                    delete this._connectionReadyResolve;
                    this.appsRegistration();
                    this._bindingSocketEvents(this.socket);
                    resolve();
                });
            });
        });
    }

    disconnect() {
        return new Promise((resolve) => this.server.close(resolve));
    }

    sendMessageToServer(socketBody) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('socket not connected'));
                return;
            }
            this.socket.emit(SOCKET_EVENTS.EMIT_MESSAGE_TO_SERVER, socketBody, resolve);
        });
    }

    appsRegistration() {
        let appIds = Object.keys(mainStore.getState().apps);
        return Promise.all(appIds.map((appId) => {
            return new Promise((resolve) => {
                this.socket.emit(SOCKET_EVENTS.APP_REGISTRATION, appId, resolve);
            });
        }));
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
                return _this.appsRegistration();
            }).then(() => {
                return keepConnection();
            });
        })();

        this.socket.on(SOCKET_EVENTS.EMIT_MESSAGE_TO_CLIENT, (data) => {
            /** @type {ChatshierChatSocketBody} */
            let socketBody = data;

            let appId = socketBody.app_id;
            let chatroomId = socketBody.chatroom_id;
            /** @type {Chatshier.ChatroomMessage[]} */
            let messages = socketBody.messages;
            let messagersFromSocket = socketBody.messagers;
            let consumersFromSocket = socketBody.consumers;

            // 根據發送的時間從早到晚排序
            messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

            if (consumersFromSocket) {
                mainStore.dispatch(updateConsumers(consumersFromSocket));
            }

            if (messagersFromSocket) {
                mainStore.dispatch(updateChatroomsMessagers(appId, chatroomId, messagersFromSocket));
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
