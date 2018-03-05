import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { appsReducer } from './reducers/apps';

const mainStore = createStore(
    combineReducers({
        router: routerReducer,
        apps: appsReducer
    })
);

export default mainStore;
