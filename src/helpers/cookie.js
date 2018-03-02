import regex from '../utils/regex';
import { YEAR } from '../utils/unitTime';

const CHSR_COOKIE = {
    USER_EMAIL: '_chsr_email',
    USER_NAME: '_chsr_username'
};
const INIT_TIME = 'Thu, 01 Jan 1970 00:00:00 UTC';

class CookieHelper {
    constructor() {
        this.domain = window.location.host.replace(regex.domainPort, '');
        this.DEFAULT_DOMAIN = this.domain.replace(regex.domainPrefix, '.');

        // 刪除之前使用的 cookie 數值
        this.getCookie('name') && this.deleteCookie('name');
        this.getCookie('email') && this.deleteCookie('email');
    }

    /**
     * @param {string} name
     * @param {string} [val]
     * @param {string} [expires]
     * @param {string} [domain]
     * @returns {boolean}
     */
    setCookie(name, val, expires, domain) {
        if (!name) {
            return false;
        }

        val = val || '';
        expires = expires || new Date(Date.now() + YEAR).toUTCString();
        domain = domain || this.DEFAULT_DOMAIN;

        document.cookie = name + '=' + val + ';expires=' + expires + ';domain=' + domain;
        return true;
    }

    /**
     * @param {string} name
     */
    getCookie(name) {
        let cookieValues = '; ' + document.cookie;
        let parts = cookieValues.split('; ' + name + '=');

        if (parts.length >= 2) {
            return unescape(parts.pop().split(';').shift());
        }
        return '';
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    deleteCookie(name) {
        let hasCookie = !!this.getCookie(name);
        if (hasCookie) {
            this.setCookie(name, '', INIT_TIME);
            hasCookie = !!this.getCookie(name);

            // 確保 cookie 有被清除
            if (hasCookie) {
                // 如果沒有被清除試著將 domain 的層級往上提升一層
                let domainSplits = this.DEFAULT_DOMAIN.split('.');
                domainSplits.shift();

                while (hasCookie && domainSplits.length >= 2) {
                    domainSplits.shift();
                    let domain = '.' + domainSplits.join('.');
                    this.setCookie(name, '', INIT_TIME, domain);
                    hasCookie = !!this.getCookie(name);
                }
            }
        }
        return true;
    }
}

export default new CookieHelper();
export { CHSR_COOKIE };
