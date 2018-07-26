import { UPDATE_CHATROOMS, DELETE_CHATROOM, DELETE_ALL_CHATROOMS,
    UPDATE_CHATROOMS_MESSAGERS, UPDATE_CHATROOMS_MESSAGES } from '../../actions/mainStore/appsChatrooms';

export const appsChatroomsReducer = (state = {}, action) => {
    /** @type {string} */
    let appId;
    /** @type {string} */
    let chatroomId;

    switch (action.type) {
        case UPDATE_CHATROOMS:
            for (appId in action.appsChatrooms) {
                /** @type {Chatshier.Model.AppsChatrooms} */
                let app = action.appsChatrooms[appId];
                state[appId] = state[appId] || { chatrooms: {} };

                let chatrooms = app.chatrooms;
                for (chatroomId in chatrooms) {
                    /** @type {Chatshier.Model.Chatroom} */
                    let chatroom = chatrooms[chatroomId];
                    if (chatroom.isDeleted) {
                        continue;
                    }

                    let stateChatroom = state[appId].chatrooms[chatroomId] || {};
                    for (let prop in chatroom) {
                        if ('object' !== typeof chatroom[prop]) {
                            stateChatroom[prop] = chatroom[prop];
                        } else {
                            stateChatroom[prop] = stateChatroom[prop] || {};
                            Object.assign(stateChatroom[prop], chatroom[prop]);
                        }
                    }
                    state[appId].chatrooms[chatroomId] = stateChatroom;
                }
            }
            return Object.assign({}, state);
        case DELETE_CHATROOM:
            appId = action.appId;
            chatroomId = action.chatroomId;

            delete state[appId].chatrooms[chatroomId];
            if (0 === Object.keys(state[appId].chatrooms).length) {
                delete state[appId].chatrooms;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_CHATROOMS:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        case UPDATE_CHATROOMS_MESSAGERS:
            appId = action.appId;
            chatroomId = action.chatroomId;
            state[appId] = state[appId] || { chatrooms: {} };
            state[appId].chatrooms[chatroomId] = state[appId].chatrooms[chatroomId] || { messagers: {} };

            let messagers = action.messagers;
            for (let messagerId in messagers) {
                let messager = messagers[messagerId];
                state[appId].chatrooms[chatroomId].messagers[messagerId] = messager;
            }
            return Object.assign({}, state);
        case UPDATE_CHATROOMS_MESSAGES:
            appId = action.appId;
            chatroomId = action.chatroomId;
            state[appId] = state[appId] || { chatrooms: {} };
            state[appId].chatrooms[chatroomId] = state[appId].chatrooms[chatroomId] || { messages: {} };

            let messages = action.messages;
            for (let messageId in messages) {
                let message = messages[messageId];
                state[appId].chatrooms[chatroomId].messages[messageId] = message;
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
