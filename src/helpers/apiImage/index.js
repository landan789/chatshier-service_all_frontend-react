import MoveFile from './MoveFile';
import UploadFile from './UploadFile';

let reqHeaders = new Headers();
reqHeaders.set('Accept', 'application/json');

class APIImage {
    constructor() {
        this.moveFile = new MoveFile();
        this.uploadFile = new UploadFile();
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

export default new APIImage();
export { reqHeaders };
