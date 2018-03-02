import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import ChatShierStore from '../../redux/ChatshierStore';
import Signin from '../Signin/Signin';

import './Routes.css';

class Routes extends Component {
    constructor(props) {
        super(props);

        this.routes = [{
            path: '/',
            exact: true,
            component: Signin
        }, {
            path: '/signin',
            exact: true,
            component: Signin
        // }, {
        //     path: '/signup',
        //     exact: true,
        //     component: Signup
        }];
    }

    shouldRedirect() {
        let routePath = window.location.pathname;
        return (() => {
            for (let i in this.routes) {
                if (this.routes[i].path === routePath) {
                    return true;
                }
            }
            return false;
        })();
    }

    render() {
        return (
            <Provider store={ChatShierStore}>
                <BrowserRouter>
                    <div className="route-wrapper">
                        <Route path="/*" render={() => !this.shouldRedirect() && (<Redirect to="/" />)} />
                        {this.routes.map((route) => {
                            return <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                component={route.component} />;
                        })}
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default Routes;
