import { UPDATE_MEMBERS, DELETE_MEMBER } from '../../actions/mainStore/groupsMembers';

export const groupsMembersReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_MEMBERS:
            for (let groupId in action.groups) {
                /** @type {Chatshier.GroupsMembers} */
                let group = action.groups[groupId];
                state[groupId] = state[groupId] || { members: {} };

                let members = group.members;
                for (let memberId in members) {
                    /** @type {Chatshier.GroupMember} */
                    let member = members[memberId];
                    if (member.isDeleted) {
                        continue;
                    }
                    state[groupId].members[memberId] = member;
                }
            }
            return Object.assign({}, state);
        case DELETE_MEMBER:
            let groupId = action.groupId;
            let memberId = action.memberId;

            delete state[groupId].members[memberId];
            if (0 === Object.keys(state[groupId].members).length) {
                delete state[groupId].members;
                delete state[groupId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
