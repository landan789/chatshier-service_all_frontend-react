import CHATSHIER from '../../config/chatshier';

class Core {
    constructor() {
        let URL = CHATSHIER.URL;
        this.apiEndPoint = URL.API + '/api/bot/';
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
     * @param {RequestInit|RequestInit[]} [reqInits]
     * @param {Boolean} [usingRecursive=false] If true, the processes will do step one by one
     * @returns {Promise<any>}
     */
    sendRequest(url, reqInits, usingRecursive) {
        reqInits = reqInits || {};
        reqInits.method = reqInits.method || 'GET';
        usingRecursive = !!usingRecursive;

        if (reqInits instanceof Array) {
            if (usingRecursive) {
                let _reqInits = reqInits;
                let resJsons = [];

                let nextPromise = (i) => {
                    if (i >= _reqInits.length) {
                        return Promise.resolve(resJsons);
                    }
                    let _reqInit = _reqInits[i];
                    _reqInit.cache = 'no-cache';
                    _reqInit.mode = 'cors';
                    _reqInit.credentials = 'include';

                    return window.fetch(url, _reqInit).then((res) => {
                        return this.responseChecking(res);
                    }).then(function(resJson) {
                        resJsons.push(resJson);
                        return nextPromise(i + 1);
                    });
                };
                return nextPromise(0);
            } else {
                return Promise.all(reqInits.map((_reqInit) => {
                    _reqInit.cache = 'no-cache';
                    _reqInit.mode = 'cors';
                    _reqInit.credentials = 'include';

                    if ('POST' === reqInits.method.toUpperCase() ||
                        'PUT' === reqInits.method.toUpperCase()) {
                        reqInits.headers.set('Content-Type', 'application/json');
                    }
                    return window.fetch(url, _reqInit).then((res) => {
                        return this.responseChecking(res);
                    });
                }));
            }
        }

        if ('POST' === reqInits.method.toUpperCase() ||
            'PUT' === reqInits.method.toUpperCase()) {
            reqInits.headers.set('Content-Type', 'application/json');
        }
        reqInits.cache = 'no-cache';
        reqInits.mode = 'cors';
        reqInits.credentials = 'include';

        return window.fetch(url, reqInits).then((res) => {
            return this.responseChecking(res);
        });
    };
}

export default Core;
