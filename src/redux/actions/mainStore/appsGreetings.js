export const UPDATE_GREETINGS = 'UPDATE_GREETINGS';
export const DELETE_GREETING = 'DELETE_GREETING';
export const DELETE_ALL_GREETINGS = 'DELETE_ALL_GREETINGS';

/**
 * @param {Chatshier.AppsGreetings} appsGreetings
 */
export const updateGreetings = (appsGreetings) => {
    return { type: UPDATE_GREETINGS, appsGreetings };
};

/**
 * @param {string} appId
 * @param {string} greetingId
 */
export const deleteGreeting = (appId, greetingId) => {
    return { type: DELETE_GREETING, appId, greetingId };
};

/**
 * @param {string} appId
 */
export const deleteAllGreetings = (appId) => {
    return { type: DELETE_ALL_GREETINGS, appId };
};
