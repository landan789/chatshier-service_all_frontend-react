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
import Analysis from './pages/Analysis/Analysis';
import Appointments from './pages/Appointments/Appointments';
import Autoreplies from './pages/Autoreplies/Autoreplies';
import Calendar from './pages/Calendar/Calendar';
import Categories from './pages/Categories/Categories';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Chat from './pages/Chat/Chat';
import Composes from './pages/Composes/Composes';
import Greetings from './pages/Greetings/Greetings';
import Keywordreplies from './pages/Keywordreplies/Keywordreplies';
import Products from './pages/Products/Products';
import Receptionists from './pages/Receptionists/Receptionists';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Settings from './pages/Settings/Settings';
import SignIn from './pages/SignIn/SignIn';
import SignOut from './pages/SignOut/SignOut';
import SignUp from './pages/SignUp/SignUp';
import Tickets from './pages/Tickets/Tickets';

// https://jquense.github.io/react-widgets/
import 'react-widgets/dist/css/react-widgets.css';
// https://react-sortable-tree.surge.sh/
import 'react-sortable-tree/style.css';
// http://idangero.us/swiper/
import 'swiper/dist/css/swiper.min.css';
// http://aaronshaf.github.io/react-toggle/
import 'react-toggle/style.css';

import 'fullcalendar';
import 'fullcalendar/dist/locale/zh-tw';
import 'fullcalendar/dist/fullcalendar.min.css';

import './index.css';

const routes = [{
    path: ROUTES.ANALYSIS,
    component: Analysis,
    exact: true
}, {
    path: ROUTES.APPOINTMENTS,
    component: Appointments,
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
    path: ROUTES.CATEGORIES,
    component: Categories,
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
    path: ROUTES.PRODUCTS,
    component: Products,
    exact: true
}, {
    path: ROUTES.RECEPTIONISTS,
    component: Receptionists,
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
}];

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
