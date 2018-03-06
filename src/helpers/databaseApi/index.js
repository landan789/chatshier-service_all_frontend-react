import Apps from './Apps';
import AppsMessagers from './AppsMessagers';
import CalendarsEvents from './CalendarsEvents';
import Users from './Users';

let jwt = '';
let reqHeaders = new Headers();

/**
 * 設定 API 驗證身份所需的 JSON Web Token
 *
 * @param {string} value
 */
const setJWT = (value) => {
    jwt = value;
    reqHeaders.set('Authorization', jwt);
};

const databaseApi = {
    apps: new Apps(),
    appsMessagers: new AppsMessagers(),
    calendarsEvents: new CalendarsEvents(),
    users: new Users()
};

export default databaseApi;
export { setJWT, jwt, reqHeaders, databaseApi };
