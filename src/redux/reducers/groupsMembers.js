import { UPDATE_GROUPS_MEMBERS, DELETE_GROUP_MEMBER } from '../actions/groupsMembers';

export const groupsMembersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_GROUPS_MEMBERS:
            for (let groupId in action.groups) {
                let group = action.groups[groupId];
                if (group.isDeleted) {
                    continue;
                }

                state[groupId] = state[groupId] || { members: {} };
                let members = group.members;
                for (let memberId in members) {
                    let member = members[memberId];
                    if (member.isDeleted) {
                        continue;
                    }
                    state[groupId].members[memberId] = member;
                }
            }
            return Object.assign({}, state);
        case DELETE_GROUP_MEMBER:
            delete state[action.groupId].members[action.memberId];
            if (0 === Object.keys(state[action.groupId].members).length) {
                delete state[action.groupId].members;
                delete state[action.groupId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
