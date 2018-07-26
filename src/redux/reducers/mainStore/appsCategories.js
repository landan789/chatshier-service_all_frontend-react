import { UPDATE_CATEGORIES, DELETE_CATEGORY,
    DELETE_ALL_CATEGORIES } from '../../actions/mainStore/appsCategories';

export const appsCategoriesReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CATEGORIES:
            for (let appId in action.appsCategories) {
                /** @type {Chatshier.Model.AppsCategories} */
                let app = action.appsCategories[appId];
                state[appId] = state[appId] || { categories: {} };

                let categories = app.categories;
                for (let categoryId in categories) {
                    /** @type {Chatshier.Category} */
                    let category = categories[categoryId];
                    if (category.isDeleted) {
                        continue;
                    }
                    state[appId].categories[categoryId] = category;
                }
            }
            return Object.assign({}, state);
        case DELETE_CATEGORY:
            let appId = action.appId;
            let categoryId = action.categoryId;

            delete state[appId].categories[categoryId];
            if (0 === Object.keys(state[appId].categories).length) {
                delete state[appId].categories;
                delete state[appId];
            }
            return Object.assign({}, state);
        case DELETE_ALL_CATEGORIES:
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
