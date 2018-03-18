import { UPDATE_MESSAGES } from '../actions/appsChatroomsMessages';

export const appsChatroomsMessagesReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_MESSAGES:
            for (let appId in action.appsChatroomsMessages) {
                /** @type {Chatshier.AppsChatroomsMessages} */
                let app = action.appsChatroomsMessages[appId];
                state[appId] = state[appId] || { chatrooms: {} };

                let chatrooms = app.chatrooms;
                for (let chatroomId in chatrooms) {
                    /** @type {Chatshier.Chatroom} */
                    let chatroom = chatrooms[chatroomId];
                    if (chatroom.isDeleted) {
                        continue;
                    }

                    if (!state[appId].chatrooms[chatroomId]) {
                        state[appId].chatrooms[chatroomId] = {
                            messages: chatroom.messages
                        };
                    } else {
                        state[appId].chatrooms[chatroomId].messages = chatroom.messages;
                    }
                }
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
