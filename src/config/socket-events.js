const SOCKET_EVENTS = {

    EMIT_MESSAGE_TO_SERVER: 'EMIT_MESSAGE_TO_SERVER',
    EMIT_MESSAGE_TO_CLIENT: 'EMIT_MESSAGE_TO_CLIENT',

    USER_REGISTRATION: 'USER_REGISTRATION',
    READ_CHATROOM_MESSAGES: 'READ_CHATROOM_MESSAGES',

    BROADCAST_MESSAGER_TO_SERVER: 'BROADCAST_MESSAGER_TO_SERVER',
    BROADCAST_MESSAGER_TO_CLIENT: 'BROADCAST_MESSAGER_TO_CLIENT',
    PUSH_COMPOSES_TO_ALL: 'PUSH_COMPOSES_TO_ALL',

    CONSUMER_FOLLOW: 'CONSUMER_FOLLOW',
    CONSUMER_UNFOLLOW: 'CONSUMER_UNFOLLOW',

    USER_ADD_GROUP_MEMBER_TO_SERVER: 'USER_ADD_GROUP_MEMBER_TO_SERVER',
    USER_ADD_GROUP_MEMBER_TO_CLIENT: 'USER_ADD_GROUP_MEMBER_TO_CLIENT',

    USER_REMOVE_GROUP_MEMBER_TO_SERVER: 'USER_REMOVE_GROUP_MEMBER_TO_SERVER',
    USER_REMOVE_GROUP_MEMBER_TO_CLIENT: 'USER_REMOVE_GROUP_MEMBER_TO_CLIENT',

    /**
     * socket.io base event (server only)
     */
    CONNECTION: 'connection',

    /**
     * socket.io base event (client only)
     */
    CONNECT: 'connect',

    /**
     * socket.io base event (client only)
     */
    RECONNECT: 'reconnect',

    /**
     * socket.io base event
     */
    DISCONNECT: 'disconnect'
};

export default SOCKET_EVENTS;
