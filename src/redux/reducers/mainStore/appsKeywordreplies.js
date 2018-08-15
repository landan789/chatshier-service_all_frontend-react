import { UPDATE_KEYWORDREPLIES, REMOVE_KEYWORDREPLY,
    REMOVE_ALL_KEYWORDREPLIES } from '../../actions/mainStore/appsKeywordreplies';

export const appsKeywordrepliesReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_KEYWORDREPLIES:
            for (let appId in action.appsKeywordreplies) {
                /** @type {Chatshier.Model.AppsKeywordreplies} */
                let app = action.appsKeywordreplies[appId];
                state[appId] = state[appId] || { keywordreplies: {} };

                let keywordreplies = app.keywordreplies;
                for (let keywordreplyId in keywordreplies) {
                    /** @type {Chatshier.Model.Keywordreply} */
                    let keywordreply = keywordreplies[keywordreplyId];
                    if (keywordreply.isDeleted) {
                        continue;
                    }
                    state[appId].keywordreplies[keywordreplyId] = keywordreply;
                }
            }
            return Object.assign({}, state);
        case REMOVE_KEYWORDREPLY:
            let appId = action.appId;
            let keywordreplyId = action.keywordreplyId;

            delete state[appId].keywordreplies[keywordreplyId];
            if (0 === Object.keys(state[appId].keywordreplies).length) {
                delete state[appId].keywordreplies;
                delete state[appId];
            }
            return Object.assign({}, state);
        case REMOVE_ALL_KEYWORDREPLIES:
            appId = action.appId;
            if (state[appId]) {
                delete state[appId];
                return Object.assign({}, state);
            }
            return state;
        default:
            return state;
    }
};
