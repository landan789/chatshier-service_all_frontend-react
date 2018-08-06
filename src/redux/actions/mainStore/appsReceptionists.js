export const UPDATE_RECEPTIONISTS = 'UPDATE_RECEPTIONISTS';
export const DELETE_RECEPTIONIST = 'DELETE_RECEPTIONIST';
export const DELETE_ALL_RECEPTIONISTS = 'DELETE_ALL_RECEPTIONISTS';
export const UPDATE_RECEPTIONISTS_SCHEDULES = 'UPDATE_RECEPTIONISTS_SCHEDULES';
export const DELETE_RECEPTIONIST_SCHEDULE = 'DELETE_RECEPTIONIST_SCHEDULE';

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
export const deleteReceptionist = (appId, receptionistId) => {
    return { type: DELETE_RECEPTIONIST, appId, receptionistId };
};

/**
 * @param {string} appId
 */
export const deleteAllReceptionists = (appId) => {
    return { type: DELETE_ALL_RECEPTIONISTS, appId };
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
export const deleteReceptionistSchedule = (appId, receptionistId, scheduleId) => {
    return { type: DELETE_RECEPTIONIST_SCHEDULE, appId, receptionistId, scheduleId };
};
