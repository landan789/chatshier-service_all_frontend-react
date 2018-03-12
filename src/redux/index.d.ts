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
}
