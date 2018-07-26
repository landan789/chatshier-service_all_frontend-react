import Apps from './Apps';
import AppsAutoreplies from './AppsAutoreplies';
import AppsCategories from './AppsCategories';
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

let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

class APIDatabase {
    constructor() {
        this.apps = new Apps();
        this.appsAutoreplies = new AppsAutoreplies();
        this.appsCategories = new AppsCategories();
        this.appsChatrooms = new AppsChatrooms();
        this.appsComposes = new AppsComposes();
        this.appsFields = new AppsFields();
        this.appsGreetings = new AppsGreetings();
        this.appsKeywordreplies = new AppsKeywordreplies();
        this.appsTickets = new AppsTickets();
        this.calendarsEvents = new CalendarsEvents();
        this.consumers = new Consumers();
        this.groups = new Groups();
        this.groupsMembers = new GroupsMembers();
        this.users = new Users();
    }

    /**
     * 設定 API 驗證身份所需的 JSON Web Token
     *
     * @param {string} jwt
     */
    setJWT(jwt = '') {
        reqHeaders.set('Authorization', jwt);
    }
}

export default new APIDatabase();
export { reqHeaders };
