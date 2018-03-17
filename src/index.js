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

import Calendar from './containers/Calendar/Calendar';
import Setting from './containers/Setting/Setting';
import SignIn from './containers/SignIn/SignIn';
import SignUp from './containers/SignUp/SignUp';
import Ticket from './containers/Ticket/Ticket';
import Greetings from './containers/Greetings/Greetings';

// https://getbootstrap.com/docs/4.0/getting-started/introduction/
import 'bootstrap/dist/css/bootstrap.min.css';
// https://jquense.github.io/react-widgets/
import 'react-widgets/dist/css/react-widgets.css';
import './index.css';

const routes = [
    {
        path: ROUTES.CALENDAR,
        component: Calendar,
        exact: true
    }, {
        path: ROUTES.CHAT,
        component: null,
        exact: true
    }, {
        path: ROUTES.SETTING,
        component: Setting,
        exact: false
    }, {
        path: ROUTES.SIGNIN,
        component: SignIn,
        exact: true
    }, {
        path: ROUTES.SIGNUP,
        component: SignUp,
        exact: true
    }, {
        path: ROUTES.GREETING,
        component: Greetings,
        exact: true
    }, {
        path: ROUTES.TICKET,
        component: Ticket,
        exact: true
    }
];

Moment.locale(window.navigator.language);
momentLocalizer(Moment);
authHelper.init();

ReactDOM.render(
    <Provider store={mainStore}>
        <BrowserRouter>
            <div className="route-wrapper">
                <Switch>
                    {routes.map((route) => (
                        <Route key={route.path}
                            exact={route.exact}
                            path={route.path}
                            component={route.component} />
                    ))}
                    <Redirect to={ROUTES.SIGNIN} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('charshier_root')
);
// registerServiceWorker();
