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
     * 設定 cookie 數值
     *
     * @param {string} name - cookie 欄位名稱
     * @param {string} [val] - cookie 欄位數值
     * @param {string} [expires] - cookie 過期時間，預設為 1 年
     * @param {string} [domain] - cookie 可動作的網域，預設為 origin 的子網域
     * @returns {boolean} - cookie 是否設定成功
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
     * 取得 cookie 數值
     *
     * @param {string} name - cookie 欄位名稱
     * @returns {string} - cookie 欄位數值
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
     * 刪除 cookie 欄位
     *
     * @param {string} name - cookie 欄位名稱
     * @returns {boolean} - cookie 是否刪除成功
     */
    deleteCookie(name) {
        let hasCookie = !!this.getCookie(name);
        if (hasCookie) {
            try {
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
            } catch (ex) {
                return false;
            }
        }
        return true;
    }
}

export default new CookieHelper();
export { CHSR_COOKIE };
