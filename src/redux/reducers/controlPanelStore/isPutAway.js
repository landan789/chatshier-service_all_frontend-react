import { PUTAWAY_PANEL } from '../../actions/controlPanelStore/isPutAway';

const IS_PUT_AWAY_STORAGE = 'isCtrlPanelPutAway';

export const isPutAwayReducer = (state = ('true' === window.localStorage.getItem(IS_PUT_AWAY_STORAGE)), action) => {
    switch (action.type) {
        case PUTAWAY_PANEL:
            state = !state;
            window.localStorage.setItem(IS_PUT_AWAY_STORAGE, state);
            return state;
        default:
            return state;
    }
};
