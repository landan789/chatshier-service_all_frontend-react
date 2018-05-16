import { UPDATE_SEARCH_KEYWORD } from '../../actions/controlPanelStore/searchKeyword';

export const searchKeywordReducer = (state = '', action) => {
    switch (action.type) {
        case UPDATE_SEARCH_KEYWORD:
            state = action.searchKeyword || '';
            return state;
        default:
            return state;
    }
};
