import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import registerServiceWorker from './registerServiceWorker';

import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import ROUTES from './config/route';
import mainStore from './redux/mainStore';

import i18n from './i18n';
import Analysis from './containers/Analysis/Analysis';
import Autoreplies from './containers/Autoreplies/Autoreplies';
import Calendar from './containers/Calendar/Calendar';
import ChangePassword from './containers/ChangePassword/ChangePassword';
import Chat from './containers/Chat/Chat';
import Composes from './containers/Composes/Composes';
import Greetings from './containers/Greetings/Greetings';
import Keywordreplies from './containers/Keywordreplies/Keywordreplies';
import ResetPassword from './containers/ResetPassword/ResetPassword';
import Settings from './containers/Settings/Settings';
import SignIn from './containers/SignIn/SignIn';
import SignOut from './containers/SignOut/SignOut';
import SignUp from './containers/SignUp/SignUp';
import Tickets from './containers/Tickets/Tickets';

// https://getbootstrap.com/docs/4.0/getting-started/introduction/
import 'bootstrap/dist/css/bootstrap.min.css';
// https://jquense.github.io/react-widgets/
import 'react-widgets/dist/css/react-widgets.css';
// http://idangero.us/swiper/
import 'swiper/dist/css/swiper.min.css';
import './index.css';

const routes = [
    {
        path: ROUTES.ANALYSIS,
        component: Analysis,
        exact: true
    }, {
        path: ROUTES.AUTOREPLIES,
        component: Autoreplies,
        exact: true
    }, {
        path: ROUTES.CALENDAR,
        component: Calendar,
        exact: true
    }, {
        path: ROUTES.CHANGE_PASSWORD,
        component: ChangePassword,
        exact: false
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
        component: Keywordreplies,
        exact: true
    }, {
        path: ROUTES.RESET_PASSWORD,
        component: ResetPassword,
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

ReactDOM.render(
    <Provider store={mainStore}>
        <I18nextProvider i18n={i18n}>
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
        </I18nextProvider>
    </Provider>,
    document.getElementById('charshierRoot'),
    () => {
        let loadingWrapper = document.getElementById('loadingWrapper');
        loadingWrapper.parentElement.removeChild(loadingWrapper);
        loadingWrapper = void 0;
    }
);
// registerServiceWorker();
