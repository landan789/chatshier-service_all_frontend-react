import { UPDATE_TAGS, DELETE_TAG } from '../actions/appsTags';

export const appsTagsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TAGS:
            for (let appId in action.appsTags) {
                /** @type {Chatshier.AppsTags} */
                let app = action.appsTags[appId];
                state[appId] = state[appId] || { tags: {} };

                let tags = app.tags;
                for (let tagId in tags) {
                    /** @type {Chatshier.Tag} */
                    let tag = tags[tagId];
                    if (tag.isDeleted) {
                        continue;
                    }
                    state[appId].tags[tagId] = tag;
                }
            }
            return Object.assign({}, state);
        case DELETE_TAG:
            let appId = action.appId;
            let tagId = action.tagId;

            delete state[appId].tags[tagId];
            if (0 === Object.keys(state[appId].tags).length) {
                delete state[appId].tags;
                delete state[appId];
            }
            return Object.assign({}, state);
        default:
            return state;
    }
};
