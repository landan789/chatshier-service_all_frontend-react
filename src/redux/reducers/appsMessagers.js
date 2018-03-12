import { UPDATE_MESSAGERS } from '../actions/appsMessagers';

export const appsMessagersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_MESSAGERS:
            for (let appId in action.appsMessagers) {
                let app = action.appsMessagers[appId];
                if (app.isDeleted) {
                    continue;
                }
                state[appId] = state[appId] || { messagers: {} };

                let messagers = action.appsMessagers[appId].messagers;
                for (let messagerId in messagers) {
                    let messager = messagers[messagerId];
                    if (messager.isDeleted) {
                        continue;
                    }
                    state[appId].messagers[messagerId] = messager;
                }
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
