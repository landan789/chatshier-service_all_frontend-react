import React from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import mainStore from '../../redux/mainStore';
import Calendar from '../Calendar/Calendar';
import Setting from '../Setting/Setting';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Ticket from '../Ticket/Ticket';

import ROUTES from '../../config/route';
import Greetings from '../Greetings/Greetings';

import './Routes.css';

class Routes extends React.Component {
    constructor(props) {
        super(props);

        this.routes = [
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
    }

    render() {
        return (
            <Provider store={mainStore}>
                <BrowserRouter>
                    <div className="route-wrapper">
                        <Switch>
                            {this.routes.map((route) => (
                                <Route key={route.path}
                                    exact={route.exact}
                                    path={route.path}
                                    component={route.component} />
                            ))}
                            <Redirect to={ROUTES.SIGNIN} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default Routes;
