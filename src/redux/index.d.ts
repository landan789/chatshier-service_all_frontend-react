namespace Chatshier {
    interface App {
        id1: string;
        id2: string;
        name: string;
        secret: string;
        token1: string;
        token2: string;
        type: string;
        group_id: string;
        webhook_id: string;
        isDeleted: 0 | 1;
        updatedTime: number;
        createdTime: number;
    }

    interface Apps {
        [appId: string]: App;
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
            [tagId: string]: any
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

    interface Group {
        app_ids: string[];
        name: string;
        isDeleted: 0 | 1;
        members: {
            [groupMemberId]: GroupMember
        };
        updatedTime: number;
        createdTime: number;
    }

    interface Groups {
        [groupId: string]: Group;
    }
}
