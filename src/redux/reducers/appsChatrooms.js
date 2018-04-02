import { UPDATE_CHATROOMS_MESSAGES } from '../actions/appsChatrooms';

export const appsChatroomsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CHATROOMS_MESSAGES:
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
        default:
            return state;
    }
};
