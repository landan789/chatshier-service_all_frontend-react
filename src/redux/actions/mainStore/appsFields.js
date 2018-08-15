export const UPDATE_FIELDS = 'UPDATE_FIELDS';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const REMOVE_ALL_FIELDS = 'REMOVE_ALL_FIELDS';

/**
 * @param {Chatshier.Model.AppsFields} appsFields
 */
export const updateFields = (appsFields) => {
    return { type: UPDATE_FIELDS, appsFields };
};

/**
 * @param {string} appId
 * @param {string} fieldId
 */
export const removeField = (appId, fieldId) => {
    return { type: REMOVE_FIELD, appId, fieldId };
};

/**
 * @param {string} appId
 */
export const removeAllFields = (appId) => {
    return { type: REMOVE_ALL_FIELDS, appId };
};
