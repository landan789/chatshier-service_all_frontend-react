import { UPDATE_APPOINTMENTS, REMOVE_APPOINTMENT,
    REMOVE_ALL_APPOINTMENTS } from '../../actions/mainStore/appsAppointments';

export const appsAppointmentsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_APPOINTMENTS:
            for (let appId in action.appsAppointments) {
                /** @type {Chatshier.Model.AppsAppointments} */
                let app = action.appsAppointments[appId];
                state[appId] = state[appId] || { appointments: {} };

                let appointments = app.appointments;
                for (let appointmentId in appointments) {
                    /** @type {Chatshier.Model.Appointment} */
                    let appointment = appointments[appointmentId];
                    if (appointment.isDeleted) {
                        continue;
                    }
                    state[appId].appointments[appointmentId] = appointment;
                }
            }
            return Object.assign({}, state);
        case REMOVE_APPOINTMENT:
            let appId = action.appId;
            let appointmentId = action.appointmentId;

            delete state[appId].appointments[appointmentId];
            if (0 === Object.keys(state[appId].appointments).length) {
                delete state[appId].appointments;
                delete state[appId];
            }
            return Object.assign({}, state);
        case REMOVE_ALL_APPOINTMENTS:
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
