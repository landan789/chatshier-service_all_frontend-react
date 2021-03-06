export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const YEAR = 365 * DAY;

/**
 * 將數字轉換為轉換為 2 個字元以上的字串
 *
 * @param {number} n
 */
export const formatTo2Digit = (n) => {
    let s = '' + n;
    return 1 === s.length ? '0' + s : s;
};

/**
 * 將日期或 unit time 轉換為 YYYY-MM-DD 格式
 *
 * @param {Date|number} date
 * @param {boolean} [shouldIncludeYear=true]
 */
export const formatDate = (date, shouldIncludeYear = true) => {
    if (!date) {
        return '';
    } else if ('number' === typeof date || 'string' === typeof date) {
        date = new Date(date);
    }
    return (shouldIncludeYear ? date.getFullYear() + '-' : '') +
        formatTo2Digit(date.getMonth() + 1) + '-' +
        formatTo2Digit(date.getDate());
};

/**
 * 將日期或 unit time 轉換為 hh:mm:ss 格式
 *
 * @param {Date|number} time
 * @param {boolean} [shouldIncludeSec=true]
 */
export const formatTime = (time, shouldIncludeSec = true) => {
    if (!time) {
        return '';
    } else if ('number' === typeof time || 'string' === typeof time) {
        time = new Date(time);
    }
    return formatTo2Digit(time.getHours()) +
        ':' + formatTo2Digit(time.getMinutes()) +
        (shouldIncludeSec ? ':' + formatTo2Digit(time.getSeconds()) : '');
};
