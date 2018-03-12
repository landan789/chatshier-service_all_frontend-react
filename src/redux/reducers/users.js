import { UPDATE_USERS } from '../actions/users';

export const usersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USERS:
            for (let userId in action.users) {
                let user = action.users[userId];
                if (user.isDeleted) {
                    continue;
                }
                state[userId] = action.users[userId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
