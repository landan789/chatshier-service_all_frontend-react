import { createStore, combineReducers } from 'redux';

const TOGGLE_MENU = 'TOGGLE_MENU';
const CLOSE_MENU = 'CLOSE_MENU';

const SELECT_CHATROOM = 'SELECT_CHATROOM';

const isOpenReducer = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_MENU:
            return !state;
        case CLOSE_MENU:
            return false;
        default:
            return state;
    }
};

const selectedChatroomReducer = (state = {}, action) => {
    switch (action.type) {
        case SELECT_CHATROOM:
            state.appId = action.appId || '';
            state.chatroomId = action.chatroomId || '';
            return Object.assign({}, state);
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    isOpen: isOpenReducer,
    selectedChatroom: selectedChatroomReducer
});
const ctrlPanelStore = createStore(rootReducer);

export default ctrlPanelStore;
export { TOGGLE_MENU, CLOSE_MENU, SELECT_CHATROOM };
