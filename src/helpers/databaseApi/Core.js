import urlConfig from '../../config/url';

class Core {
    constructor() {
        let config = window.urlConfig || urlConfig;
        this.prefixUrl = config.apiUrl + '/api/';
    }

    /**
     * @param {Response} res
     */
    responseChecking(res) {
        if (!res.ok && res.status < 500) {
            return Promise.reject(new Error(res.status + ' ' + res.statusText));
        }

        if (!res.ok && res.status >= 500) {
            return res.json().then((resJson) => {
                return Promise.reject(resJson);
            });
        }

        return res.json().then((resJson) => {
            if (1 !== resJson.status) {
                return Promise.reject(resJson);
            }
            return resJson;
        });
    };

    /**
     * @param {RequestInfo} reqInfo
     * @param {RequestInit} reqInit
     */
    sendRequest(reqInfo, reqInit) {
        return window.fetch(reqInfo, reqInit).then((res) => {
            return this.responseChecking(res);
        });
    };
}

export default Core;
