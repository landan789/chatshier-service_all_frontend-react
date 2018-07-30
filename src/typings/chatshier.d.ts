declare module Chatshier {
    interface JWT {
        adu: string;
        exp: number;
        iat: number;
        iss: string;
        sub: string;
        uid: string;
    }

    namespace Socket {
        interface MessageBody {
            app_id: string;
            chatroom_id: string;
            senderUid: string;
            recipientUid: string;
            type: string;
            chatroom?: Chatshier.Models.Chatroom;
            consumers?: Chatshier.Models.Consumer;
            messages: Message[]
        }
    
        interface Message {
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
}