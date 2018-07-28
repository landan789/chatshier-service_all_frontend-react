import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/mainStore/apps';
import { appsAutorepliesReducer } from './reducers/mainStore/appsAutoreplies';
import { appsCategoriesReducer } from './reducers/mainStore/appsCategories';
import { appsChatroomsReducer } from './reducers/mainStore/appsChatrooms';
import { appsComposesReducer } from './reducers/mainStore/appsComposes';
import { appsFieldsReducer } from './reducers/mainStore/appsFields';
import { appsGreetingsReducer } from './reducers/mainStore/appsGreetings';
import { appsKeywordrepliesReducer } from './reducers/mainStore/appsKeywordreplies';
import { appsProductsReducer } from './reducers/mainStore/appsProducts';
import { appsReceptionistsReducer } from './reducers/mainStore/appsReceptionists';
import { appsTicketsReducer } from './reducers/mainStore/appsTickets';
import { calendarsEventsReducer } from './reducers/mainStore/calendarsEvents';
import { consumersReducer } from './reducers/mainStore/consumers';
import { groupsReducer } from './reducers/mainStore/groups';
import { groupsMembersReducer } from './reducers/mainStore/groupsMembers';
import { usersReducer } from './reducers/mainStore/users';

const rootReducer = combineReducers({
    router: routerReducer,
    apps: appsReducer,
    appsAutoreplies: appsAutorepliesReducer,
    appsCategories: appsCategoriesReducer,
    appsChatrooms: appsChatroomsReducer,
    appsComposes: appsComposesReducer,
    appsFields: appsFieldsReducer,
    appsGreetings: appsGreetingsReducer,
    appsKeywordreplies: appsKeywordrepliesReducer,
    appsProducts: appsProductsReducer,
    appsReceptionists: appsReceptionistsReducer,
    appsTickets: appsTicketsReducer,
    calendarsEvents: calendarsEventsReducer,
    consumers: consumersReducer,
    groups: groupsReducer,
    groupsMembers: groupsMembersReducer,
    users: usersReducer
});

const mainStore = createStore(rootReducer);

export default mainStore;
