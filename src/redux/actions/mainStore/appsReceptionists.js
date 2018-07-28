export const UPDATE_RECEPTIONISTS = 'UPDATE_RECEPTIONISTS';
export const DELETE_RECEPTIONIST = 'DELETE_RECEPTIONIST';
export const DELETE_ALL_RECEPTIONISTS = 'DELETE_ALL_RECEPTIONISTS';

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
