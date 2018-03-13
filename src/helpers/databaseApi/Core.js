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

        let hasJsonHeader =
            res.headers.get('Content-Type').includes('application/json') ||
            res.headers.get('content-type').includes('application/json');
        if (!res.ok && res.status >= 500 && hasJsonHeader) {
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
     * @param {RequestInit} reqInits
     */
    sendRequest(reqInfo, reqInits, usingRecursive) {
        usingRecursive = !!usingRecursive;

        if (reqInits instanceof Array) {
            if (usingRecursive) {
                let _reqInits = reqInits;
                let resJsons = [];

                let nextPromise = function(i) {
                    if (i >= _reqInits.length) {
                        return Promise.resolve(resJsons);
                    }
                    let _reqInit = _reqInits[i];

                    return window.fetch(reqInfo, _reqInit).then(function(res) {
                        return this.responseChecking(res);
                    }).then(function(resJson) {
                        resJsons.push(resJson);
                        return nextPromise(i + 1);
                    });
                };
                return nextPromise(0);
            } else {
                return Promise.all(reqInits.map((_reqInit) => {
                    return window.fetch(reqInfo, _reqInit).then(function(res) {
                        return this.responseChecking(res);
                    });
                }));
            }
        }

        return window.fetch(reqInfo, reqInits).then((res) => {
            return this.responseChecking(res);
        });
    };
}

export default Core;
