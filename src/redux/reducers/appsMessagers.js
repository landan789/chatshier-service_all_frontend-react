import { UPDATE_MESSAGERS } from '../actions/appsMessagers';

export const appsMessagersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_MESSAGERS:
            for (let appId in action.appsMessagers) {
                state[appId] = state[appId] || { messagers: {} };

                let messagers = action.appsMessagers[appId].messagers;
                for (let messagerId in messagers) {
                    state[appId].messagers[messagerId] = messagers[messagerId];
                }
            }
            return state;
        default:
            return state;
    }
};
