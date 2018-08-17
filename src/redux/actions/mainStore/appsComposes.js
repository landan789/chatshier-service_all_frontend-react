export const UPDATE_COMPOSES = 'UPDATE_COMPOSES';
export const REMOVE_COMPOSE = 'REMOVE_COMPOSE';
export const REMOVE_ALL_COMPOSES = 'REMOVE_ALL_COMPOSES';

/**
 * @param {Chatshier.Model.AppsComposes} appsComposes
 */
export const updateComposes = (appsComposes) => {
    return { type: UPDATE_COMPOSES, appsComposes };
};

/**
 * @param {string} appId
 * @param {string} composeId
 */
export const removeCompose = (appId, composeId) => {
    return { type: REMOVE_COMPOSE, appId, composeId };
};

/**
 * @param {string} appId
 */
export const removeAllComposes = (appId) => {
    return { type: REMOVE_ALL_COMPOSES, appId };
};
