import { UPDATE_APPS, REMOVE_APP } from '../actions/apps';

export const appsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_APPS:
            for (let appId in action.apps) {
                state[appId] = action.apps[appId];
            }
            return state;
        case REMOVE_APP:
            delete state[action.appId];
            return state;
        default:
            return state;
    }
};
