import { UPDATE_MESSAGERS } from '../actions/appsMessagers';

export const appsMessagersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_MESSAGERS:
            for (let appId in action.appsMessagers) {
                /** @type {Chatshier.AppsMessagers} */
                let app = action.appsMessagers[appId];
                state[appId] = state[appId] || { messagers: {} };

                let messagers = app.messagers;
                for (let messagerId in messagers) {
                    /** @type {Chatshier.Messager} */
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
