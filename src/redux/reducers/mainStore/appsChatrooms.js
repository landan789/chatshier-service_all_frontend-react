import { UPDATE_CHATROOMS, UPDATE_CHATROOMS_MESSAGERS,
    UPDATE_CHATROOMS_MESSAGES } from '../../actions/mainStore/appsChatrooms';

export const appsChatroomsReducer = (state = {}, action) => {
    /** @type {string} */
    let appId;
    /** @type {string} */
    let chatroomId;

    switch (action.type) {
        case UPDATE_CHATROOMS:
            for (let appId in action.appsChatrooms) {
                /** @type {Chatshier.AppsChatrooms} */
                let app = action.appsChatrooms[appId];
                state[appId] = state[appId] || { chatrooms: {} };

                let chatrooms = app.chatrooms;
                for (let chatroomId in chatrooms) {
                    /** @type {Chatshier.Chatroom} */
                    let chatroom = chatrooms[chatroomId];
                    if (chatroom.isDeleted) {
                        continue;
                    }
                    state[appId].chatrooms[chatroomId] = chatroom;
                }
            }
            return Object.assign({}, state);
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
                console.log(state[appId].chatrooms[chatroomId].messages[messageId]);
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
