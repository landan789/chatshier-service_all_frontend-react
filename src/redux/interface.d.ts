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
        isDeleted?: 0 | 1;
        updatedTime?: number;
        createdTime?: number;
    }

    interface Apps {
        [appId: string]: App;
    }

    interface Autoreply {
        isDeleted?: 0 | 1;
        createdTime?: number;
        startedTime: number;
        endedTime: number;
        title: string;
        text: string;
        type: 'text';
        updatedTime?: number;
    }

    interface AppsAutoreplies {
        [appId: string]: {
            autoreplies: {
                [autoreplyId: string]: Autoreply
            }
        };
    }

    interface Message {
        text: string,
        type: 'text';
        messager_id: string;
        from: 'SYSTEM' | 'CHATSHIER' | 'LINE' | 'FACEBOOK';
        time: number;
        isDeleted?: 0 | 1;
    }

    interface Chatroom {
        createdTime?: number;
        updatedTime?: number;
        isDeleted?: 0 | 1;
        messages: {
            [messageId: string]: Message
        }
    }

    interface AppsChatroomsMessages {
        [appId: string]: {
            chatrooms: {
                [chatroomId: string]: Chatroom
            }
        };
    }

    interface Compose {
        time: number;
        status: 0 | 1;
        type: 'text';
        text: string;
        isDeleted?: 0 | 1;
        age: number;
        gender: string;
        tag_ids: string[];
    }

    interface AppsComposes {
        [appId: string]: {
            composes: {
                [composeId: string]: Compose
            }
        };
    }

    interface Greeting {
        createdTime?: number;
        updatedTime?: number;
        type: 'text';
        text: string;
        isDeleted?: 0 | 1;
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
        status: 0 | 1;
        createdTime?: number;
        updatedTime?: number;
        isDeleted?: 0 | 1;
    }

    interface AppsKeywordreplies {
        [appId: string]: {
            keywordreplies: {
                [keywordreplyId: string]: Keywordreply
            }
        }
    }

    interface Messager {
        name: string;
        photo: string;
        age: number;
        gender: string;
        phone: string;
        assigned: string;
        email: string;
        remark: string;
        firstChat: number;
        recentChat: number;
        avgChat: number;
        totalChat: number;
        chatTimeCount: number;
        chatroom_id: string;
        custom_tags?: {
            [tagId: string]: string | number | any[]
        };
        isDeleted?: 0 | 1;
    }

    interface AppsMessagers {
        [appId: string]: {
            messagers: {
                [messagerId: string]: Messager
            }
        }
    }

    interface Tag {
        text: string;
        alias: string;
        type: 'SYSTEM' | 'DEFAULT' | 'DEFAULT';
        sets: string[] | number[];
        setsType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'CHECKBOX';
        order: number;
        createdTime?: number;
        updatedTime?: number;
        isDeleted?: 0 | 1;
    }

    interface AppsTags {
        [appId: string]: {
            tags: {
                [tagId: string]: Tag
            }
        }
    }

    interface Ticket {
        createdTime?: number;
        description: string;
        dueTime: number;
        priority: number;
        messager_id: string;
        status: number;
        updatedTime?: number;
        isDeleted?: 0 | 1;
    }

    interface AppsTickets {
        [appId: string]: {
            tickets: {
                [ticketId: string]: Ticket
            }
        };
    }

    interface CalendarEvent {
        isAllDay: 0 | 1;
        isDeleted?: 0 | 1;
        description: string;
        createdTime?: number;
        updatedTime?: number;
        endedTime: number;
        startedTime: number;
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
        isDeleted?: 0 | 1;
        updatedTime?: number;
        createdTime?: number;
    }

    interface Groups {
        [groupId: string]: Group;
    }

    interface GroupMember {
        user_id: string;
        /**
         * 0 邀請中 ; 1 已加入
         */
        status: 0 | 1;
        /**
         * OWNER 群組擁有者 ; ADMIN 群組管理員 ; WRITE 群組可修改 ; READ 群組可查看
         */
        type: 'OWNER' | 'ADMIN' | 'WRITE' | 'READ';
        isDeleted?: 0 | 1;
        updatedTime?: number;
        createdTime?: number;
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
        createdTime?: number;
        updatedTime?: number;
    }

    interface Users {
        [userId: string]: User;
    }
}
