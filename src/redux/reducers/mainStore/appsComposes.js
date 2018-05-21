import { UPDATE_COMPOSES, DELETE_COMPOSE,
    DELETE_ALL_COMPOSES } from '../../actions/mainStore/appsComposes';

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
            let composeId = action.composeId;

            delete state[appId].composes[composeId];
            if (0 === Object.keys(state[appId].composes).length) {
                delete state[appId].composes;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_COMPOSES:
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
