import { UPDATE_APPS, DELETE_APP } from '../actions/apps';

export const appsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_APPS:
            for (let appId in action.apps) {
                let app = action.apps[appId];
                if (app.isDeleted) {
                    continue;
                }
                state[appId] = action.apps[appId];
            }
            return Object.assign({}, state);
        case DELETE_APP:
            let appId = action.appId;

            delete state[appId];
            return Object.assign({}, state);
        default:
            return state;
    }
};
