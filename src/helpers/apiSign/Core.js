import chatshierCfg from '../../config/chatshier';

class Core {
    constructor() {
        let URL = chatshierCfg.URL;
        this.apiEndPoint = URL.apiUrl + '/api/sign/';
    }

    /**
     * @param {Response} res
     */
    responseChecking(res) {
        if (!res.ok && res.status < 500) {
            return Promise.reject(new Error(res.status + ' ' + res.statusText));
        }

        if (!res.ok && res.status >= 500) {
            let hasJsonHeader =
                res.headers.get('Content-Type').includes('application/json') ||
                res.headers.get('content-type').includes('application/json');
            if (!hasJsonHeader) {
                return res.body.getReader().read().then((body) => {
                    return Promise.reject(body);
                });
            }

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
        if ('POST' === reqInit.method.toUpperCase() ||
            'PUT' === reqInit.method.toUpperCase()) {
            reqInit.headers.set('Content-Type', 'application/json');
        }
        reqInit.cache = 'no-cache';
        reqInit.mode = 'cors';
        reqInit.credentials = 'include';

        return window.fetch(reqInfo, reqInit).then((res) => {
            return this.responseChecking(res);
        });
    };
}

export default Core;
