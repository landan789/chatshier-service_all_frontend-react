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
        isDeleted: 0 | 1;
        updatedTime: number;
        createdTime: number;
    }

    interface Apps {
        [appId: string]: App;
    }

    interface Autoreply {
        isDeleted: 0 | 1;
        createdTime: number;
        startedTime: number;
        endedTime: number;
        title: string;
        text: string;
        type: 'text';
        updatedTime: number;
    }

    interface AppsAutoreplies {
        [appId: string]: {
            autoreplies: {
                [autoreplyId: string]: Autoreply
            }
        };
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
        custom_tags: {
            [tagId: string]: string | number | any[]
        };
        isDeleted: 0 | 1;
    }

    interface AppsMessagers {
        [appId: string]: {
            messagers: {
                [messagerId: string]: Messager
            }
        }
    }

    interface Ticket {
        createdTime: number;
        description: string;
        dueTime: number;
        priority: number;
        messager_id: string;
        status: number;
        updatedTime: number;
        isDeleted: 0 | 1;
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
        isDeleted: 0 | 1;
        description: string;
        createdTime: number;
        updatedTime: number;
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
        isDeleted: 0 | 1;
        updatedTime: number;
        createdTime: number;
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
        isDeleted: 0 | 1;
        updatedTime: number;
        createdTime: number;
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
        group_ids: string[];
        createdTime: number;
        updatedTime: number;
    }

    interface Users {
        [userId: string]: User;
    }
}
