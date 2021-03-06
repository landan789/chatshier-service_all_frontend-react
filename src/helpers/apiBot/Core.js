import authHlp from '../../helpers/authentication';

import CHATSHIER from '../../config/chatshier';

class Core {
    constructor() {
        let URL = CHATSHIER.URL;
        this.apiEndPoint = URL.API + '/api/bot/';
    }

    get userId() {
        return authHlp.userId;
    }

    /**
     * @param {Response} res
     */
    responseChecking(res) {
        if (!res.ok && res.status < 500) {
            return Promise.reject(res);
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
     * @param {string} url
     * @param {RequestInit} [reqInit]
     * @param {boolean} [isFormData]
     * @returns {Promise<any>}
     */
    sendRequest(url, reqInit, isFormData) {
        reqInit = reqInit || {};
        reqInit.method = reqInit.method || 'GET';

        let method = reqInit.method.toUpperCase();
        if (('POST' === method || 'PUT' === method) && !isFormData) {
            reqInit.headers.set('Content-Type', 'application/json');
        }
        reqInit.cache = 'no-cache';
        reqInit.mode = 'cors';
        reqInit.credentials = 'include';

        return window.fetch(url, reqInit).then((res) => {
            return this.responseChecking(res);
        });
    };
}

export default Core;
