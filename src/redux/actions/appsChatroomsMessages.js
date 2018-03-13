export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';

/**
 * @param {Chatshier.AppsChatroomsMessages} appsChatroomsMessages
 */
export const updateMessages = (appsChatroomsMessages) => {
    return { type: UPDATE_MESSAGES, appsChatroomsMessages };
};
