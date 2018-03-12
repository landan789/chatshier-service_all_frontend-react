import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/apps';
import { appsMessagersReducer } from './reducers/appsMessagers';
import { appsTicketsReducer } from './reducers/appsTickets';
import { groupsReducer } from './reducers/groups';
import { groupsMembersReducer } from './reducers/groupsMembers';
import { usersReducer } from './reducers/users';

const rootReducer = combineReducers({
    router: routerReducer,
    apps: appsReducer,
    appsMessagers: appsMessagersReducer,
    appsTickets: appsTicketsReducer,
    groups: groupsReducer,
    groupsMembers: groupsMembersReducer,
    users: usersReducer
});

const mainStore = createStore(rootReducer);

export default mainStore;
