import { UPDATE_CHATROOMS, REMOVE_CHATROOM, REMOVE_ALL_CHATROOMS,
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
        case REMOVE_CHATROOM:
            appId = action.appId;
            chatroomId = action.chatroomId;

            delete state[appId].chatrooms[chatroomId];
            if (0 === Object.keys(state[appId].chatrooms).length) {
                delete state[appId].chatrooms;
                delete state[appId];
            }
            return Object.assign({}, state);
        case REMOVE_ALL_CHATROOMS:
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
            Object.assign(state[appId].chatrooms[chatroomId].messagers, action.messagers);
            return Object.assign({}, state);
        case UPDATE_CHATROOMS_MESSAGES:
            appId = action.appId;
            chatroomId = action.chatroomId;
            state[appId] = state[appId] || { chatrooms: {} };
            state[appId].chatrooms[chatroomId] = state[appId].chatrooms[chatroomId] || { messages: {} };
            Object.assign(state[appId].chatrooms[chatroomId].messages, action.messages);
            return Object.assign({}, state);
        default:
            return state;
    }
};
