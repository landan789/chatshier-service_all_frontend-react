import { UPDATE_FIELDS, DELETE_FIELD,
    DELETE_ALL_FIELDS } from '../../actions/mainStore/appsFields';

export const appsFieldsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_FIELDS:
            for (let appId in action.appsFields) {
                /** @type {Chatshier.AppsFields} */
                let app = action.appsFields[appId];
                state[appId] = state[appId] || { fields: {} };

                let fields = app.fields;
                for (let fieldId in fields) {
                    /** @type {Chatshier.Field} */
                    let field = fields[fieldId];
                    if (field.isDeleted) {
                        continue;
                    }
                    state[appId].fields[fieldId] = field;
                }
            }
            return Object.assign({}, state);
        case DELETE_FIELD:
            let appId = action.appId;
            let fieldId = action.fieldId;

            delete state[appId].fields[fieldId];
            if (0 === Object.keys(state[appId].fields).length) {
                delete state[appId].fields;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_FIELDS:
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
