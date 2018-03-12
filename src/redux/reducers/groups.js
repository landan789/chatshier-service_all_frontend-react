import { UPDATE_GROUPS, DELETE_GROUP } from '../actions/groups';

export const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_GROUPS:
            for (let groupId in action.groups) {
                let group = action.groups[groupId];
                if (group.isDeleted) {
                    continue;
                }
                state[groupId] = action.groups[groupId];
            }
            return Object.assign({}, state);
        case DELETE_GROUP:
            delete state[action.groupId];
            return Object.assign({}, state);
        default:
            return state;
    }
};
