export const UPDATE_APPS = 'UPDATE_APP';
export const REMOVE_APP = 'REMOVE_APP';

/**
 * @param {Chatshier.Model.Apps} apps
 */
export const updateApps = (apps) => {
    return { type: UPDATE_APPS, apps };
};

/**
 * @param {string} appId
 */
export const removeApp = (appId) => {
    return { type: REMOVE_APP, appId };
};
