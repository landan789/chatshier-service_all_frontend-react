export const UPDATE_CHATROOMS = 'UPDATE_CHATROOMS';
export const REMOVE_CHATROOM = 'REMOVE_CHATROOM';
export const REMOVE_ALL_CHATROOMS = 'REMOVE_ALL_CHATROOMS';
export const UPDATE_CHATROOMS_MESSAGERS = 'UPDATE_CHATROOMS_MESSAGERS';
export const UPDATE_CHATROOMS_MESSAGES = 'UPDATE_CHATROOMS_MESSAGES';

/**
 * @param {Chatshier.Model.AppsChatrooms} appsChatrooms
 */
export const updateChatrooms = (appsChatrooms) => {
    return { type: UPDATE_CHATROOMS, appsChatrooms };
};

/**
 * @param {string} appId
 * @param {string} chatroomId
 */
export const removeChatroom = (appId, chatroomId) => {
    return { type: REMOVE_CHATROOM, appId: appId, chatroomId: chatroomId };
};

/**
 * @param {string} appId
 */
export const removeAllChatrooms = (appId) => {
    return { type: REMOVE_ALL_CHATROOMS, appId: appId };
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
