import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/apps';
import { appsAutorepliesReducer } from './reducers/appsAutoreplies';
import { appsChatroomsMessagesReducer } from './reducers/appsChatroomsMessages';
import { appsComposesReducer } from './reducers/appsComposes';
import { appsGreetingsReducer } from './reducers/appsGreetings';
import { appsKeywordrepliesReducer } from './reducers/appsKeywordreplies';
import { appsMessagersReducer } from './reducers/appsMessagers';
import { appsFieldsReducer } from './reducers/appsFields';
import { appsTicketsReducer } from './reducers/appsTickets';
import { calendarsEventsReducer } from './reducers/calendarsEvents';
import { groupsReducer } from './reducers/groups';
import { groupsMembersReducer } from './reducers/groupsMembers';
import { usersReducer } from './reducers/users';

const rootReducer = combineReducers({
    router: routerReducer,
    apps: appsReducer,
    appsAutoreplies: appsAutorepliesReducer,
    appsChatroomsMessages: appsChatroomsMessagesReducer,
    appsComposes: appsComposesReducer,
    appsGreetings: appsGreetingsReducer,
    appsKeywordreplies: appsKeywordrepliesReducer,
    appsMessagers: appsMessagersReducer,
    appsFields: appsFieldsReducer,
    appsTickets: appsTicketsReducer,
    calendarsEvents: calendarsEventsReducer,
    groups: groupsReducer,
    groupsMembers: groupsMembersReducer,
    users: usersReducer
});

const mainStore = createStore(rootReducer);

export default mainStore;
