import { UPDATE_RECEPTIONISTS, DELETE_RECEPTIONIST,
    DELETE_ALL_RECEPTIONISTS } from '../../actions/mainStore/appsReceptionists';

export const appsReceptionistsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_RECEPTIONISTS:
            for (let appId in action.appsReceptionists) {
                /** @type {Chatshier.Model.AppsReceptionists} */
                let app = action.appsReceptionists[appId];
                state[appId] = state[appId] || { receptionists: {} };

                let receptionists = app.receptionists;
                for (let receptionistId in receptionists) {
                    /** @type {Chatshier.Model.Receptionist} */
                    let receptionist = receptionists[receptionistId];
                    if (receptionist.isDeleted) {
                        continue;
                    }
                    state[appId].receptionists[receptionistId] = receptionist;
                }
            }
            return Object.assign({}, state);
        case DELETE_RECEPTIONIST:
            let appId = action.appId;
            let receptionistId = action.receptionistId;

            delete state[appId].receptionists[receptionistId];
            if (0 === Object.keys(state[appId].receptionists).length) {
                delete state[appId].receptionists;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_RECEPTIONISTS:
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
