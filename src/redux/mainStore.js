import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/apps';
import { appsAutorepliesReducer } from './reducers/appsAutoreplies';
import { appsChatroomsReducer } from './reducers/appsChatrooms';
import { appsComposesReducer } from './reducers/appsComposes';
import { appsFieldsReducer } from './reducers/appsFields';
import { appsGreetingsReducer } from './reducers/appsGreetings';
import { appsKeywordrepliesReducer } from './reducers/appsKeywordreplies';
import { appsTicketsReducer } from './reducers/appsTickets';
import { calendarsEventsReducer } from './reducers/calendarsEvents';
import { consumersReducer } from './reducers/consumers';
import { groupsReducer } from './reducers/groups';
import { groupsMembersReducer } from './reducers/groupsMembers';
import { usersReducer } from './reducers/users';

const rootReducer = combineReducers({
    router: routerReducer,
    apps: appsReducer,
    appsAutoreplies: appsAutorepliesReducer,
    appsChatrooms: appsChatroomsReducer,
    appsComposes: appsComposesReducer,
    appsFields: appsFieldsReducer,
    appsGreetings: appsGreetingsReducer,
    appsKeywordreplies: appsKeywordrepliesReducer,
    appsTickets: appsTicketsReducer,
    calendarsEvents: calendarsEventsReducer,
    consumers: consumersReducer,
    groups: groupsReducer,
    groupsMembers: groupsMembersReducer,
    users: usersReducer
});

const mainStore = createStore(rootReducer);

export default mainStore;
