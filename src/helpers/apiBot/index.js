import Files from './Files';
import Chatrooms from './Chatrooms';
import Richmenus from './Richmenus';

let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

class APIBot {
    constructor() {
        this.files = new Files();
        this.chatrooms = new Chatrooms();
        this.richmenus = new Richmenus();
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

export default new APIBot();
export { reqHeaders };
