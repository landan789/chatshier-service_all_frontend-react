import Core from './Core';
import { reqHeaders } from './index';

class UploadFile extends Core {
    constructor() {
        super();
        this.apiEndPoint += 'upload-file/';
    }

    /**
     * @param {File} file
     * @returns {Promise<{ status: number, msg: string, data: { url: string, originalFilePath: string } }>}
     */
    post(file) {
        let destUrl = this.apiEndPoint + 'users/' + this.userId;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        // 由於要使用 formData, Content-type 不同，因此使用新的 Headers
        let _reqHeaders = new Headers();
        _reqHeaders.set('Authorization', reqHeaders.get('Authorization'));

        let reqInit = {
            method: 'POST',
            headers: _reqHeaders,
            body: formData
        };
        return this.sendRequest(destUrl, reqInit, true);
    }
}
export default UploadFile;
