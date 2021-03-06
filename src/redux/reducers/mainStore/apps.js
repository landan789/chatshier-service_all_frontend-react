import { UPDATE_APPS, REMOVE_APP } from '../../actions/mainStore/apps';

export const appsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_APPS:
            for (let appId in action.apps) {
                /** @type {Chatshier.Model.App} */
                let app = action.apps[appId];
                if (app.isDeleted) {
                    continue;
                }
                state[appId] = action.apps[appId];
            }
            return Object.assign({}, state);
        case REMOVE_APP:
            let appId = action.appId;

            delete state[appId];
            return Object.assign({}, state);
        default:
            return state;
    }
};
