import { createStore, combineReducers } from 'redux';

import { isOpenReducer } from './reducers/controlPanelStore/isOpen';
import { isPutAwayReducer } from './reducers/controlPanelStore/isPutAway';
import { selectedChatroomReducer } from './reducers/controlPanelStore/selectedChatroom';

const rootReducer = combineReducers({
    isOpen: isOpenReducer,
    isPutAway: isPutAwayReducer,
    selectedChatroom: selectedChatroomReducer
});
const controlPanelStore = createStore(rootReducer);

export default controlPanelStore;
