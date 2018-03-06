import Base from './Base';
import { reqHeaders } from './databaseApi';

/**
 * 宣告專門處理 CalendarsEvents 相關的 API 類別
 */
class CalendarsEvents extends Base {
    constructor() {
        super();

        this.urlPrefix = this.prefixUrl + 'calendars-events/';
    }

    /**
     * 取得使用者所有的 calendar 事件
     *
     * @param {string} userId - 使用者的 firebase id
     */
    getAll(userId) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'GET',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 插入一筆 calendar 事件
     *
     * @param {string} userId - 使用者的 firebase ID
     * @param {*} calendarData - 要進行插入的 calendar 事件資料
     */
    insert(userId, calendarData) {
        let destUrl = this.urlPrefix + 'users/' + userId;
        let reqInit = {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(calendarData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 更新一筆指定的 calendar 事件
     *
     * @param {string} calendarId - 識別不同行事曆的 ID
     * @param {string} eventId - calendar 的事件ID
     * @param {string} userId - 使用者的 firebase ID
     * @param {*} calendarData - 要進行更新的 calendar 事件資料
     */
    update(calendarId, eventId, userId, calendarData) {
        let destUrl = this.urlPrefix + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
        let reqInit = {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify(calendarData)
        };
        return this.sendRequest(destUrl, reqInit);
    };

    /**
     * 移除一筆指定的 calendar 事件
     *
     * @param {string} calendarId - 識別不同行事曆的 ID
     * @param {string} eventId - calendar 的事件ID
     * @param {string} userId - 要進行更新的 calendar 事件資料
     */
    remove(calendarId, eventId, userId) {
        let destUrl = this.urlPrefix + 'calendars/' + calendarId + '/events/' + eventId + '/users/' + userId;
        let reqInit = {
            method: 'DELETE',
            headers: reqHeaders
        };
        return this.sendRequest(destUrl, reqInit);
    };
}

export default CalendarsEvents;
