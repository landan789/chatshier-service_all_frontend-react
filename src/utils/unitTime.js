export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const YEAR = 365 * DAY;

/**
 * @param {number} n
 */
export function formatTo2Digit(n) {
    let s = '' + n;
    return 1 === s.length ? '0' + s : s;
}

/**
 * @param {Date|number} date
 */
export function formatDate(date) {
    if (!date) {
        return '';
    } else if ('number' === typeof date) {
        date = new Date(date);
    }
    return date.getFullYear() +
        '-' + formatTo2Digit(date.getMonth() + 1) +
        '-' + formatTo2Digit(date.getDate());
}

/**
 * @param {Date|number} time
 * @param {boolean} [includeSec=true]
 */
export function formatTime(time, includeSec = true) {
    if (!time) {
        return '';
    } else if ('number' === typeof time) {
        time = new Date(time);
    }
    return formatTo2Digit(time.getHours()) +
        ':' + formatTo2Digit(time.getMinutes()) +
        (includeSec ? ':' + formatTo2Digit(time.getSeconds()) : '');
}
