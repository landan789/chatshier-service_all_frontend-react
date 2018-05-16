namespace Chatshier {
    interface JWT {
        adu: string;
        exp: number;
        iat: number;
        iss: string;
        sub: string;
        uid: string;
    }

    interface SocketMessageBody {
        app_id: string;
        chatroom_id: string;
        senderUid: string;
        recipientUid: string;
        type: string;
        chatroom?: Chatshier.Chatroom;
        consumers?: Chatshier.Consumer;
        messages: SocketMessage[]
    }

    interface SocketMessage {
        _id?: string;
        from: 'LINE' | 'FACEBOOK' | 'CHATSHIER' | 'SYSTEM';
        messager_id: string;
        src: File | string;
        text: string;
        time: number;
        type: string;
        fileName?: string;
    }
}