import Apps from './Apps';
import AppsMessagers from './AppsMessagers';
import AppsTickets from './AppsTickets';
import AppsGreetings from './AppsGreetings';
import CalendarsEvents from './CalendarsEvents';
import Users from './Users';

import cookieHelper from '../cookie';

let jwt = '';
let reqHeaders = new Headers();
reqHeaders.set('Content-Type', 'application/json');

/**
 * 設定 API 驗證身份所需的 JSON Web Token
 *
 * @param {string} value
 */
const setJWT = (value) => {
    jwt = value;
    reqHeaders.set('Authorization', jwt);
};
cookieHelper.hasSignedin() && setJWT(window.localStorage.getItem('jwt'));

const databaseApi = {
    apps: new Apps(),
    appsMessagers: new AppsMessagers(),
    appsGreetings: new AppsGreetings(),
    appsTickets: new AppsTickets(),
    calendarsEvents: new CalendarsEvents(),
    users: new Users()
};

export default databaseApi;
export { databaseApi, setJWT, jwt, reqHeaders };
