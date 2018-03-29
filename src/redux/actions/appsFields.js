export const UPDATE_FIELDS = 'UPDATE_FIELDS';
export const DELETE_FIELD = 'DELETE_FIELD';

/**
 * @param {Chatshier.AppsFields} appsFields
 */
export const updateFields = (appsFields) => {
    return { type: UPDATE_FIELDS, appsFields };
};

/**
 * @param {string} appId
 * @param {string} fieldId
 */
export const deleteField = (appId, fieldId) => {
    return { type: DELETE_FIELD, appId, fieldId };
};
