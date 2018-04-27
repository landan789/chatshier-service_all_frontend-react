import { SELECT_CHATROOM } from '../../actions/controlPanelStore/selectedChatroom';

export const selectedChatroomReducer = (state = {}, action) => {
    switch (action.type) {
        case SELECT_CHATROOM:
            state.appId = action.appId || '';
            state.chatroomId = action.chatroomId || '';
            return Object.assign({}, state);
        default:
            return state;
    }
};
