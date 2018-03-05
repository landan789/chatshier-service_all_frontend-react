import React from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import mainStore from '../../redux/mainStore';
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';

import './Routes.css';

class Routes extends React.Component {
    constructor(props) {
        super(props);

        this.routes = [{
            path: '/',
            component: Signin
        }, {
            path: '/signin',
            component: Signin
        }, {
            path: '/signup',
            component: Signup
        }, {
            path: '/chat',
            component: null
        }];
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

    setBrowserTitle(title) {
        document.title = title;
        return null;
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
