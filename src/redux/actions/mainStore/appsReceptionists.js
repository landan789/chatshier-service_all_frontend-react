export const UPDATE_RECEPTIONISTS = 'UPDATE_RECEPTIONISTS';
export const REMOVE_RECEPTIONIST = 'REMOVE_RECEPTIONIST';
export const REMOVE_ALL_RECEPTIONISTS = 'REMOVE_ALL_RECEPTIONISTS';
export const UPDATE_RECEPTIONISTS_SCHEDULES = 'UPDATE_RECEPTIONISTS_SCHEDULES';
export const REMOVE_RECEPTIONIST_SCHEDULE = 'REMOVE_RECEPTIONIST_SCHEDULE';

/**
 * @param {Chatshier.Model.AppsReceptionists} appsReceptionists
 */
export const updateReceptionists = (appsReceptionists) => {
    return { type: UPDATE_RECEPTIONISTS, appsReceptionists };
};

/**
 * @param {string} appId
 * @param {string} receptionistId
 */
export const removeReceptionist = (appId, receptionistId) => {
    return { type: REMOVE_RECEPTIONIST, appId, receptionistId };
};

/**
 * @param {string} appId
 */
export const removeAllReceptionists = (appId) => {
    return { type: REMOVE_ALL_RECEPTIONISTS, appId };
};

/**
 * @param {string} appId
 * @param {string} receptionistId
 * @param {{[scheduleId: string]: Chatshier.Models.Schedules}} schedules
 */
export const updateReceptionistsSchedules = (appId, receptionistId, schedules) => {
    return { type: UPDATE_RECEPTIONISTS_SCHEDULES, appId, receptionistId, schedules };
};

/**
 * @param {string} appId
 * @param {string} receptionistId
 * @param {string} scheduleId
 */
export const removeReceptionistSchedule = (appId, receptionistId, scheduleId) => {
    return { type: REMOVE_RECEPTIONIST_SCHEDULE, appId, receptionistId, scheduleId };
};
