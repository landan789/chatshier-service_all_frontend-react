import Core from './Core';
import { reqHeaders } from './index';

class Files extends Core {
    /**
     * @param {string} appId
     * @param {File} file
     */
    uploadFile(appId, file) {
        let destUrl = this.apiEndPoint + 'upload-file/users/' + this.userId + '?appid=' + appId;
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
        return this.sendRequest(destUrl, reqInit);
    }

    /**
     * @param {string} appId
     * @param {string} richMenuId
     * @param {string} path
     */
    moveFile(appId, richMenuId, path) {
        let destUrl = this.apiEndPoint + 'move-file/users/' + this.userId + '?appid=' + appId + '&richmenuid=' + richMenuId + '&path=' + path;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default Files;
