import { UPDATE_AUTOREPLIES, DELETE_AUTOREPLY } from '../actions/appsAutoreplies';

export const appsAutorepliesReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_AUTOREPLIES:
            for (let appId in action.appsAutoreplies) {
                let app = action.appsAutoreplies[appId];
                if (app.isDeleted) {
                    continue;
                }

                state[appId] = state[appId] || { tickets: {} };
                let autoreplies = app.autoreplies;
                for (let autoreplyId in autoreplies) {
                    let autoreply = autoreplies[autoreplyId];
                    if (autoreply.isDeleted) {
                        continue;
                    }
                    state[appId].autoreplies[autoreplyId] = autoreply;
                }
            }
            return Object.assign({}, state);
        case DELETE_AUTOREPLY:
            let appId = action.appId;
            let autoreplyId = action.autoreplyId;

            delete state[appId].autoreplies[autoreplyId];
            if (0 === Object.keys(state[appId].autoreplies).length) {
                delete state[appId].autoreplies;
                delete state[appId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
