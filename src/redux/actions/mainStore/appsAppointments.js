export const UPDATE_APPOINTMENTS = 'UPDATE_APPOINTMENTS';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const DELETE_ALL_APPOINTMENTS = 'DELETE_ALL_APPOINTMENTS';

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
export const deleteAppointment = (appId, appointmentId) => {
    return { type: DELETE_APPOINTMENT, appId, appointmentId };
};

/**
 * @param {string} appId
 */
export const deleteAllAppointments = (appId) => {
    return { type: DELETE_ALL_APPOINTMENTS, appId };
};
