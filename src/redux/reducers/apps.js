import { INSERT_APP, UPDATE_APP, REMOVE_APP } from '../actions/apps';

export const appsReducer = (state = {}, action) => {
    switch (action.type) {
        case INSERT_APP:
            if (!state[action.appId]) {
                state[action.appId] = action.app;
            }
            return state;
        case UPDATE_APP:
            state[action.appId] = action.app;
            return state;
        case REMOVE_APP:
            delete state[action.appId];
            return state;
        default:
            return state;
    }
};
