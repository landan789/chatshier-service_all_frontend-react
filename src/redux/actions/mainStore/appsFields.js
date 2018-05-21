export const UPDATE_FIELDS = 'UPDATE_FIELDS';
export const DELETE_FIELD = 'DELETE_FIELD';
export const DELETE_ALL_FIELDS = 'DELETE_ALL_FIELDS';

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

/**
 * @param {string} appId
 */
export const deleteAllFields = (appId) => {
    return { type: DELETE_ALL_FIELDS, appId };
};
