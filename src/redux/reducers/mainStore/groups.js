import { UPDATE_GROUPS, REMOVE_GROUP } from '../../actions/mainStore/groups';

export const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_GROUPS:
            for (let groupId in action.groups) {
                /** @type {Chatshier.Group} */
                let group = action.groups[groupId];
                if (group.isDeleted) {
                    continue;
                }
                state[groupId] = action.groups[groupId];
            }
            return Object.assign({}, state);
        case REMOVE_GROUP:
            let groupId = action.groupId;

            delete state[groupId];
            return Object.assign({}, state);
        default:
            return state;
    }
};
