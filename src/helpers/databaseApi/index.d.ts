interface AppsResponse {
    status: number,
    msg: string,
    data: Chatshier.Apps
}

interface AppsMessagersResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsAutoreplies
}

interface AppsMessagersResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsMessagers
}

interface AppsTicketsResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsTickets
}

interface AuthenticationsResponse {
    status: number,
    msg: string,
    data: { [userId]: firebase.User }
}

interface GroupsResponse {
    status: number,
    msg: string,
    data: Chatshier.Groups
}

interface GroupsMembersResponse {
    status: number,
    msg: string,
    data: Chatshier.GroupsMembers
}

interface UsersResponse {
    status: number,
    msg: string,
    data: Chatshier.Users
}
