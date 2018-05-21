import { UPDATE_AUTOREPLIES, DELETE_AUTOREPLY,
    DELETE_ALL_AUTOREPLIES } from '../../actions/mainStore/appsAutoreplies';

export const appsAutorepliesReducer = (state = {}, action) => {
    let appId;

    switch (action.type) {
        case UPDATE_AUTOREPLIES:
            for (appId in action.appsAutoreplies) {
                /** @type {Chatshier.AppsAutoreplies} */
                let app = action.appsAutoreplies[appId];
                state[appId] = state[appId] || { autoreplies: {} };

                let autoreplies = app.autoreplies;
                for (let autoreplyId in autoreplies) {
                    /** @type {Chatshier.Autoreply} */
                    let autoreply = autoreplies[autoreplyId];
                    if (autoreply.isDeleted) {
                        continue;
                    }
                    state[appId].autoreplies[autoreplyId] = autoreply;
                }
            }
            return Object.assign({}, state);
        case DELETE_AUTOREPLY:
            appId = action.appId;
            let autoreplyId = action.autoreplyId;

            delete state[appId].autoreplies[autoreplyId];
            if (0 === Object.keys(state[appId].autoreplies).length) {
                delete state[appId].autoreplies;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_AUTOREPLIES:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        default:
            return state;
    }
};
