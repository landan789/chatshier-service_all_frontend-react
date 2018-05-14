import { TOGGLE_PANEL, CLOSE_PANEL } from '../../actions/controlPanelStore/isOpen';

export const isOpenReducer = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_PANEL:
            return !state;
        case CLOSE_PANEL:
            return false;
        default:
            return state;
    }
};
