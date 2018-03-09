import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/apps';
import { appsMessagersReducer } from './reducers/appsMessagers';
import { appsTicketsReducer } from './reducers/appsTickets';

const mainStore = createStore(
    combineReducers({
        router: routerReducer,
        apps: appsReducer,
        appsMessagers: appsMessagersReducer,
        appsTickets: appsTicketsReducer
    })
);

export default mainStore;
