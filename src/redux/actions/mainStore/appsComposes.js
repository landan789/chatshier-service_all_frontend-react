export const UPDATE_COMPOSES = 'UPDATE_COMPOSES';
export const DELETE_COMPOSE = 'DELETE_COMPOSE';
export const DELETE_ALL_COMPOSES = 'DELETE_ALL_COMPOSES';

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
export const deleteCompose = (appId, composeId) => {
    return { type: DELETE_COMPOSE, appId, composeId };
};

/**
 * @param {string} appId
 */
export const deleteAllComposes = (appId) => {
    return { type: DELETE_ALL_COMPOSES, appId };
};
