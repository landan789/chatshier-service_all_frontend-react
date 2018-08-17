export const UPDATE_APPOINTMENTS = 'UPDATE_APPOINTMENTS';
export const REMOVE_APPOINTMENT = 'REMOVE_APPOINTMENT';
export const REMOVE_ALL_APPOINTMENTS = 'REMOVE_ALL_APPOINTMENTS';

/**
 * @param {Chatshier.Model.AppsAppointments} appsAppointments
 */
export const updateAppointments = (appsAppointments) => {
    return { type: UPDATE_APPOINTMENTS, appsAppointments };
};

/**
 * @param {string} appId
 * @param {string} appointmentId
 */
export const removeAppointment = (appId, appointmentId) => {
    return { type: REMOVE_APPOINTMENT, appId, appointmentId };
};

/**
 * @param {string} appId
 */
export const removeAllAppointments = (appId) => {
    return { type: REMOVE_ALL_APPOINTMENTS, appId };
};
