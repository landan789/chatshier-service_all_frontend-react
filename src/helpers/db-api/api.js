import Apps from './Apps';
import AppsMessagers from './AppsMessagers';
import CalendarsEvents from './CalendarsEvents';

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

class API {
    constructor() {
        this.apps = new Apps();
        this.appsMessagers = new AppsMessagers();
        this.calendarsEvents = new CalendarsEvents();
    }
}

export default new API();
export { setJWT, reqHeaders };
