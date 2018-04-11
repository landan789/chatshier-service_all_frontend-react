import Apps from './Apps';
import AppsAutoreplies from './AppsAutoreplies';
import AppsChatrooms from './AppsChatrooms';
import AppsComposes from './AppsComposes';
import AppsFields from './AppsFields';
import AppsGreetings from './AppsGreetings';
import AppsKeywordreplies from './AppsKeywordreplies';
import AppsTickets from './AppsTickets';
import CalendarsEvents from './CalendarsEvents';
import Consumers from './Consumers';
import Groups from './Groups';
import GroupsMembers from './GroupsMembers';
import Users from './Users';

import cookieHelper from '../cookie';

let jwt = '';
let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

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

const apiDatabase = {
    apps: new Apps(),
    appsAutoreplies: new AppsAutoreplies(),
    appsChatrooms: new AppsChatrooms(),
    appsComposes: new AppsComposes(),
    appsFields: new AppsFields(),
    appsGreetings: new AppsGreetings(),
    appsKeywordreplies: new AppsKeywordreplies(),
    appsTickets: new AppsTickets(),
    calendarsEvents: new CalendarsEvents(),
    consumers: new Consumers(),
    groups: new Groups(),
    groupsMembers: new GroupsMembers(),
    users: new Users()
};

export default apiDatabase;
export { apiDatabase, setJWT, jwt, reqHeaders };
