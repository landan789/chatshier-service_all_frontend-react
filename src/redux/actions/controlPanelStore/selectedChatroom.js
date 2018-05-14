
export const SELECT_CHATROOM = 'SELECT_CHATROOM';

/**
 * @param {string} appId
 * @param {string} chatroomId
 */
export const selectChatroom = (appId, chatroomId) => {
    return {
        type: SELECT_CHATROOM,
        appId: appId,
        chatroomId: chatroomId
    };
};
