import { UPDATE_USERS } from '../../actions/mainStore/users';

export const usersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USERS:
            for (let userId in action.users) {
                /** @type {Chatshier.User} */
                let user = action.users[userId];
                state[userId] = user;
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
