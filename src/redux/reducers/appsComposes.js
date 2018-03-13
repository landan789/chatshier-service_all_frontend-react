import { UPDATE_COMPOSES, DELETE_COMPOSE } from '../actions/appsComposes';

export const appsComposesReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_COMPOSES:
            for (let appId in action.appsComposes) {
                /** @type {Chatshier.AppsComposes} */
                let app = action.appsComposes[appId];
                state[appId] = state[appId] || { composes: {} };

                let composes = app.composes;
                for (let composeId in composes) {
                    /** @type {Chatshier.Compose} */
                    let compose = composes[composeId];
                    if (compose.isDeleted) {
                        continue;
                    }
                    state[appId].composes[composeId] = compose;
                }
            }
            return Object.assign({}, state);
        case DELETE_COMPOSE:
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
