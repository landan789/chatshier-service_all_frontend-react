export const UPDATE_CHATROOMS = 'UPDATE_CHATROOMS';
export const UPDATE_CHATROOMS_MESSAGERS = 'UPDATE_CHATROOMS_MESSAGERS';
export const UPDATE_CHATROOMS_MESSAGES = 'UPDATE_CHATROOMS_MESSAGES';

/**
 * @param {Chatshier.AppsChatrooms} appsChatrooms
 */
export const updateChatrooms = (appsChatrooms) => {
    return { type: UPDATE_CHATROOMS, appsChatrooms };
};

/**
 * @param {string} appId
 * @param {string} chatroomId
 * @param {{[messagerId: string]: Chatshier.ChatroomMessager}} messagers
 */
export const updateChatroomsMessagers = (appId, chatroomId, messagers) => {
    return {
        type: UPDATE_CHATROOMS_MESSAGERS,
        appId: appId,
        chatroomId: chatroomId,
        messagers: messagers
    };
};

/**
 * @param {string} appId
 * @param {string} chatroomId
 * @param {{[messageId: string]: Chatshier.ChatroomMessage}} messages
 */
export const updateChatroomsMessages = (appId, chatroomId, messages) => {
    return {
        type: UPDATE_CHATROOMS_MESSAGES,
        appId: appId,
        chatroomId: chatroomId,
        messages: messages
    };
};
