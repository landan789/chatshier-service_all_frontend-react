import Core from './Core';
import { reqHeaders } from './index';

class MoveFile extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'move-file/';
    }

    /**
     * @param {string} fromPath
     * @param {string} toPath
     * @returns {Promise<{ status: number, msg: string }>}
     */
    post(fromPath, toPath) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId + '?frompath=' + fromPath + '&topath=' + toPath;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    }
}
export default MoveFile;
