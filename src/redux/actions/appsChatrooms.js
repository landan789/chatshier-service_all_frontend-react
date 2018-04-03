export const UPDATE_CHATROOMS_MESSAGES = 'UPDATE_CHATROOMS_MESSAGES';

/**
 * @param {Chatshier.AppsChatrooms} appsChatrooms
 */
export const updateChatroomsMessages = (appsChatrooms) => {
    return { type: UPDATE_CHATROOMS_MESSAGES, appsChatrooms };
};
