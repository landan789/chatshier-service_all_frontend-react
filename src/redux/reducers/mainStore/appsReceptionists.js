import { UPDATE_RECEPTIONISTS, REMOVE_RECEPTIONIST,
    REMOVE_ALL_RECEPTIONISTS, UPDATE_RECEPTIONISTS_SCHEDULES,
    REMOVE_RECEPTIONIST_SCHEDULE } from '../../actions/mainStore/appsReceptionists';

export const appsReceptionistsReducer = (state = {}, action) => {
    let appId;
    let receptionistId;

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
        case REMOVE_RECEPTIONIST:
            appId = action.appId;
            receptionistId = action.receptionistId;

            delete state[appId].receptionists[receptionistId];
            if (0 === Object.keys(state[appId].receptionists).length) {
                delete state[appId].receptionists;
                delete state[appId];
            }
            return Object.assign({}, state);
        case REMOVE_ALL_RECEPTIONISTS:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        case UPDATE_RECEPTIONISTS_SCHEDULES:
            appId = action.appId;
            receptionistId = action.receptionistId;
            state[appId] = state[appId] || { receptionists: {} };
            state[appId].receptionists[receptionistId] = state[appId].receptionists[receptionistId] || { schedules: {} };

            let schedules = action.schedules;
            Object.assign(state[appId].receptionists[receptionistId].schedules, schedules || {});
            return Object.assign({}, state);
        case REMOVE_RECEPTIONIST_SCHEDULE:
            appId = action.appId;
            receptionistId = action.receptionistId;
            let scheduleId = action.scheduleId;

            if (!(state[appId] &&
                state[appId].receptionists &&
                state[appId].receptionists[receptionistId] &&
                state[appId].receptionists[receptionistId].schedules &&
                state[appId].receptionists[receptionistId].schedules[scheduleId])) {
                return state;
            }

            delete state[appId].receptionists[receptionistId].schedules[scheduleId];
            return Object.assign({}, state);
        default:
            return state;
    }
};
