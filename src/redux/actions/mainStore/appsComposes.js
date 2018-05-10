export const UPDATE_COMPOSES = 'UPDATE_COMPOSES';
export const DELETE_COMPOSE = 'DELETE_COMPOSE';

/**
 * @param {Chatshier.AppsComposes} appsComposes
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
