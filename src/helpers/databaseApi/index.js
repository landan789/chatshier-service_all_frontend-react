import Apps from './Apps';
import AppsAutoreplies from './AppsAutoreplies';
import AppsChatroomsMessages from './AppsChatroomsMessages';
import AppsComposes from './AppsComposes';
import AppsGreetings from './AppsGreetings';
import AppsKeywordreplies from './AppsKeywordreplies';
import AppsMessagers from './AppsMessagers';
import AppsTags from './AppsTags';
import AppsTickets from './AppsTickets';
import CalendarsEvents from './CalendarsEvents';
import Groups from './Groups';
import GroupsMembers from './GroupsMembers';
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
    window.localStorage.setItem('jwt', jwt);
    reqHeaders.set('Authorization', jwt);
};
cookieHelper.hasSignedin() && setJWT(window.localStorage.getItem('jwt'));

const databaseApi = {
    apps: new Apps(),
    appsAutoreplies: new AppsAutoreplies(),
    appsChatroomsMessages: new AppsChatroomsMessages(),
    appsComposes: new AppsComposes(),
    appsGreetings: new AppsGreetings(),
    appsKeywordreplies: new AppsKeywordreplies(),
    appsMessagers: new AppsMessagers(),
    appsTags: new AppsTags(),
    appsTickets: new AppsTickets(),
    calendarsEvents: new CalendarsEvents(),
    groups: new Groups(),
    groupsMembers: new GroupsMembers(),
    users: new Users()
};

export default databaseApi;
export { databaseApi, setJWT, jwt, reqHeaders };
