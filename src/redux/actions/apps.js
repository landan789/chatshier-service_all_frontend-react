export const UPDATE_APPS = 'UPDATE_APP';
export const DELETE_APP = 'DELETE_APP';

/**
 * @param {Apps} apps
 */
export const updateApps = (apps) => {
    return { type: UPDATE_APPS, apps };
};

/**
 * @param {string} appId
 */
export const deleteApp = (appId) => {
    return { type: DELETE_APP, appId };
};
