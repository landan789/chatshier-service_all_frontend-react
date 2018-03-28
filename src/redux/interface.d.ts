namespace Chatshier {
    interface App {
        id1: string;
        id2: string;
        name: string;
        secret: string;
        token1: string;
        token2: string;
        type: 'SYSTEM' | 'CHATSHIER' | 'LINE' | 'FACEBOOK';
        group_id: string;
        webhook_id: string;
        isDeleted?: boolean;
        updatedTime?: string;
        createdTime?: string;
    }

    interface Apps {
        [appId: string]: App;
    }

    interface Autoreply {
        isDeleted?: boolean;
        createdTime?: string;
        startedTime: string;
        endedTime: string;
        title: string;
        text: string;
        type: 'text';
        updatedTime?: string;
    }

    interface AppsAutoreplies {
        [appId: string]: {
            autoreplies: {
                [autoreplyId: string]: Autoreply
            }
        };
    }

    interface ChatroomMessager {
        isDeleted?: boolean;
        unRead: number;
    }

    interface ChatroomMessage {
        text: string;
        type: 'text';
        messager_id: string;
        from: 'SYSTEM' | 'CHATSHIER' | 'LINE' | 'FACEBOOK';
        time: string;
        isDeleted?: boolean;
    }

    interface Chatroom {
        createdTime?: string;
        updatedTime?: string;
        isDeleted?: boolean;
        messagers: {
            [messagerId: string]: ChatroomMessager
        };
        messages: {
            [messageId: string]: ChatroomMessage
        };
    }

    interface AppsChatroomsMessages {
        [appId: string]: {
            chatrooms: {
                [chatroomId: string]: Chatroom
            }
        };
    }

    interface Compose {
        time: string;
        status: boolean;
        type: 'text';
        text: string;
        isDeleted?: boolean;
        age: number;
        gender: string;
        field_ids: string[];
    }

    interface AppsComposes {
        [appId: string]: {
            composes: {
                [composeId: string]: Compose
            }
        };
    }

    interface Field {
        text: string;
        alias: string;
        type: 'SYSTEM' | 'DEFAULT' | 'DEFAULT';
        sets: string[] | number[];
        setsType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'CHECKBOX';
        order: number;
        createdTime?: string;
        updatedTime?: string;
        isDeleted?: boolean;
    }

    interface AppsFields {
        [appId: string]: {
            fields: {
                [fieldId: string]: Field
            }
        }
    }

    interface Greeting {
        createdTime?: string;
        updatedTime?: string;
        type: 'text';
        text: string;
        isDeleted?: boolean;
    }

    interface AppsGreetings {
        [appId: string]: {
            greetings: {
                [greetingId: string]: Greeting
            }
        };
    }

    interface Keywordreply {
        keyword: string;
        text: string;
        type: 'text',
        replyCount: number;
        status: boolean;
        createdTime?: string;
        updatedTime?: string;
        isDeleted?: boolean;
    }

    interface AppsKeywordreplies {
        [appId: string]: {
            keywordreplies: {
                [keywordreplyId: string]: Keywordreply
            }
        }
    }

    interface Messager {
        createdTime?: string;
        updatedTime?: string;
        name: string;
        photo: string;
        age: number;
        gender: string;
        phone: string;
        assigned: string;
        email: string;
        remark: string;
        lastTime: string;
        avgChat: number;
        totalChat: number;
        chatCount: number;
        chatroom_id: string;
        custom_fields?: {
            [fieldId: string]: string | number | any[]
        };
        isDeleted?: boolean;
    }

    interface AppsMessagers {
        [appId: string]: {
            messagers: {
                [messagerId: string]: Messager
            }
        }
    }

    interface Ticket {
        createdTime?: string;
        updatedTime?: string;
        description: string;
        dueTime: string;
        priority: number;
        messager_id: string;
        status: number;
        isDeleted?: boolean;
    }

    interface AppsTickets {
        [appId: string]: {
            tickets: {
                [ticketId: string]: Ticket
            }
        };
    }

    interface CalendarEvent {
        isAllDay: boolean;
        isDeleted?: boolean;
        description: string;
        createdTime?: string;
        updatedTime?: string;
        endedTime: string;
        startedTime: string;
        title: string;
    }

    interface CalendarsEvents {
        [calendarId: string]: {
            events: {
                [eventId: string]: CalendarEvent
            }
        }
    }

    interface Group {
        app_ids: string[];
        name: string;
        isDeleted?: boolean;
        updatedTime?: string;
        createdTime?: string;
    }

    interface Groups {
        [groupId: string]: Group;
    }

    interface GroupMember {
        user_id: string;
        /**
         * false 邀請中 ; true 已加入
         */
        status: boolean;
        /**
         * OWNER 群組擁有者 ; ADMIN 群組管理員 ; WRITE 群組可修改 ; READ 群組可查看
         */
        type: 'OWNER' | 'ADMIN' | 'WRITE' | 'READ';
        isDeleted?: boolean;
        updatedTime?: string;
        createdTime?: string;
    }

    interface GroupsMembers {
        [groupId: string]: {
            members: {
                [memberId]: GroupMember
            }
        };
    }

    interface User {
        company: string;
        phone: string;
        address: string;
        group_ids?: string[];
        createdTime?: string;
        updatedTime?: string;
    }

    interface Users {
        [userId: string]: User;
    }
}
