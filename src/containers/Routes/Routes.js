import React from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

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
                path: '/',
                component: SignIn
            }, {
                path: ROUTES.CALENDAR,
                component: Calendar
            }, {
                path: ROUTES.CHAT,
                component: null
            }, {
                path: ROUTES.SETTING,
                component: Setting
            }, {
                path: ROUTES.SIGNIN,
                component: SignIn
            }, {
                path: ROUTES.SIGNUP,
                component: SignUp
            }, {
                path: ROUTES.GREETING,
                component: Greetings
            }, {
                path: ROUTES.TICKET,
                component: Ticket
            }
        ];
    }

    shouldRedirect() {
        let routePath = window.location.pathname;
        return (() => {
            for (let i in this.routes) {
                if (this.routes[i].path === routePath) {
                    return false;
                }
            }
            return true;
        })();
    }

    render() {
        return (
            <Provider store={mainStore}>
                <BrowserRouter>
                    <div className="route-wrapper">
                        <Route path="/*" render={() => this.shouldRedirect() && (<Redirect to="/signin" />)}></Route>
                        {this.routes.map((route) => {
                            return <Route exact
                                key={route.path}
                                path={route.path}
                                component={route.component}>
                            </Route>;
                        })}
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default Routes;
