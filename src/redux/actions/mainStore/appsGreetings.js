export const UPDATE_GREETINGS = 'UPDATE_GREETINGS';
export const REMOVE_GREETING = 'REMOVE_GREETING';
export const REMOVE_ALL_GREETINGS = 'REMOVE_ALL_GREETINGS';

/**
 * @param {Chatshier.Model.AppsGreetings} appsGreetings
 */
export const updateGreetings = (appsGreetings) => {
    return { type: UPDATE_GREETINGS, appsGreetings };
};

/**
 * @param {string} appId
 * @param {string} greetingId
 */
export const removeGreeting = (appId, greetingId) => {
    return { type: REMOVE_GREETING, appId, greetingId };
};

/**
 * @param {string} appId
 */
export const removeAllGreetings = (appId) => {
    return { type: REMOVE_ALL_GREETINGS, appId };
};
