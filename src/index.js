import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import registerServiceWorker from './registerServiceWorker';

import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import ROUTES from './config/route';
import authHelper from './helpers/authentication';
import mainStore from './redux/mainStore';

import Analyze from './containers/Analyze/Analyze';
import Autoreply from './containers/Autoreply/Autoreply';
import Calendar from './containers/Calendar/Calendar';
import Chat from './containers/Chat/Chat';
import Composes from './containers/Composes/Composes';
import Greetings from './containers/Greetings/Greetings';
import Keywordrepies from './containers/Keywordrepies/Keywordrepies';
import Settings from './containers/Settings/Settings';
import SignIn from './containers/SignIn/SignIn';
import SignOut from './containers/SignOut/SignOut';
import SignUp from './containers/SignUp/SignUp';
import Tickets from './containers/Tickets/Tickets';

// https://getbootstrap.com/docs/4.0/getting-started/introduction/
import 'bootstrap/dist/css/bootstrap.min.css';
// https://jquense.github.io/react-widgets/
import 'react-widgets/dist/css/react-widgets.css';
import './index.css';

const routes = [
    {
        path: ROUTES.ANALYZE,
        component: Analyze,
        exact: true
    }, {
        path: ROUTES.AUTOREPLIES,
        component: Autoreply,
        exact: true
    }, {
        path: ROUTES.CALENDAR,
        component: Calendar,
        exact: true
    }, {
        path: ROUTES.CHAT,
        component: Chat,
        exact: true
    }, {
        path: ROUTES.COMPOSES,
        component: Composes,
        exact: true
    }, {
        path: ROUTES.GREETINGS,
        component: Greetings,
        exact: true
    }, {
        path: ROUTES.KEYWORDREPLIES,
        component: Keywordrepies,
        exact: true
    }, {
        path: ROUTES.SETTINGS,
        component: Settings,
        exact: false
    }, {
        path: ROUTES.SIGNIN,
        component: SignIn,
        exact: true
    }, {
        path: ROUTES.SIGNOUT,
        component: SignOut,
        exact: true
    }, {
        path: ROUTES.SIGNUP,
        component: SignUp,
        exact: true
    }, {
        path: ROUTES.TICKETS,
        component: Tickets,
        exact: true
    }
];

Moment.locale(window.navigator.language);
momentLocalizer(Moment);
authHelper.init();

ReactDOM.render(
    <Provider store={mainStore}>
        <BrowserRouter>
            <Switch>
                {routes.map((route) => (
                    <Route key={route.path}
                        exact={route.exact}
                        path={route.path}
                        component={route.component} />
                ))}
                <Redirect to={ROUTES.SIGNIN} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('charshier_root')
);
// registerServiceWorker();
