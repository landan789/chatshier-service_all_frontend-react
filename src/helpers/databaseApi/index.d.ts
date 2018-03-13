interface AppsResponse {
    status: number,
    msg: string,
    data: Chatshier.Apps
}

interface AppsAutorepliesResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsAutoreplies
}

interface AppsChatroomsMessagesResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsChatroomsMessages
}

interface AppsComposesResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsComposes
}

interface AppsGreetingsResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsGreetings
}

interface AppsKeywordrepliesResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsKeywordreplies
}

interface AppsMessagersResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsMessagers
}

interface AppsTagsResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsTags
}

interface AppsTicketsResponse {
    status: number,
    msg: string,
    data: Chatshier.AppsTickets
}

interface AuthenticationsResponse {
    status: number,
    msg: string,
    data: { [userId: string]: firebase.User }
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
