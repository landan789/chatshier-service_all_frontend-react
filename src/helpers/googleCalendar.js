import CHATSHIER from '../config/chatshier';
import { RRule, RRuleSet, rrulestr } from 'rrule';

const GOOGLE_CLIENT_NOT_SIGNEDIN = 'GOOGLE_CLIENT_NOT_SIGNEDIN';
const GOOGLE_API_ENDPOINT = 'https://apis.google.com/js/api.js';

let isGoogleapiLoaded = false;

class GoogleCalendarHelper {
    constructor() {
        this.googleReady = new Promise((resolve) => {
            this.googleReadyResolve = resolve;
        });

        this.eventCaches = { items: [] };
        this.onSignChangeListeners = {};

        this._mapRes = this._mapRes.bind(this);
        this.loadCalendarApi();
    }

    get isSignedIn() {
        return !!this.googleAuth && this.googleAuth.isSignedIn.get();
    }

    loadCalendarApi() {
        if (isGoogleapiLoaded) {
            return Promise.resolve();
        }

        let script = document.createElement('script');
        script.src = GOOGLE_API_ENDPOINT;
        document.head.appendChild(script);
        isGoogleapiLoaded = true;

        return new Promise((resolve) => (script.onload = resolve)).then(() => {
            return new Promise((resolve) => window.gapi.load('client:auth2', resolve));
        }).then(() => {
            return window.gapi.client.init({
                apiKey: CHATSHIER.GOOGLE_CALENDAR.API_KEY,
                clientId: CHATSHIER.GOOGLE_CALENDAR.CLIENT_ID,
                discoveryDocs: CHATSHIER.GOOGLE_CALENDAR.DISCOVERY_DOCS,
                scope: CHATSHIER.GOOGLE_CALENDAR.SCOPES
            });
        }).then(() => {
            return window.gapi.auth2.getAuthInstance();
        }).then((auth) => {
            this.googleAuth = auth;
            this.googleReadyResolve && this.googleReadyResolve();
            this.googleReadyResolve = void 0;
        }).catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
    }

    signIn() {
        return Promise.resolve().then(() => {
            if (!this.googleAuth) {
                return window.gapi.auth2.getAuthInstance().then((auth) => {
                    this.googleAuth = auth;
                });
            }
        }).then(() => {
            let signInOpts = {
                prompt: 'select_account' // 每一次進行登入時都 popup 出選擇帳號的視窗
            };

            return this.googleReady.then(() => {
                return this.googleAuth.signIn(signInOpts);
            }).then((currentUser) => {
                if (!currentUser) {
                    return;
                }
                return currentUser.getBasicProfile();
            }).then((profile) => {
                for (let listenerId in this.onSignChangeListeners) {
                    this.onSignChangeListeners[listenerId](this.isSignedIn);
                }
                return profile;
            });
        });
    }

    /**
     * @returns {Promise<any>}
     */
    signOut() {
        if (!this.isSignedIn) {
            return Promise.resolve();
        }

        return this.googleReady.then(() => {
            return this.googleAuth.signOut();
        }).then(() => {
            this.eventCaches = { items: [] };
            for (let listenerId in this.onSignChangeListeners) {
                this.onSignChangeListeners[listenerId](false);
            }
        });
    }

    /**
     * @param {() => any} callback
     * @returns {number}
     */
    addSignChangeListener(callback) {
        let listenerId = Date.now();
        this.onSignChangeListeners[listenerId] = callback;
        return listenerId;
    }

    /**
     * @param {string} [listenerId]
     */
    removeSignChangeListener(listenerId) {
        if (!listenerId) {
            for (let listenerId in this.onSignChangeListeners) {
                delete this.onSignChangeListeners[listenerId];
            }
            return true;
        } else if (this.onSignChangeListeners[listenerId]) {
            return delete this.onSignChangeListeners[listenerId];
        }
        return false;
    }

    /**
     * @param {string} [calendarId="primary"]
     */
    findEvents(calendarId) {
        calendarId = calendarId || 'primary';

        if (this.eventCaches.items.length > 0) {
            return Promise.resolve(this.eventCaches);
        }

        return this.googleReady.then(() => {
            if (!this.isSignedIn) {
                return Promise.reject(new Error(GOOGLE_CLIENT_NOT_SIGNEDIN));
            }

            return window.gapi.client.calendar.events.list({
                calendarId: calendarId,
                showDeleted: false
            }).then(this._mapRes).then((resJson) => {
                this.eventCaches = resJson;
                return resJson;
            });
        });
    }

    /**
     * @param {string} calendarId
     * @param {string} eventId
     * @param {any} event
     */
    updateEvent(calendarId, eventId, event) {
        return this.googleReady.then(() => {
            if (!this.isSignedIn) {
                return Promise.reject(new Error(GOOGLE_CLIENT_NOT_SIGNEDIN));
            }

            return window.gapi.client.calendar.events.update({
                calendarId: calendarId,
                eventId: eventId,
                resource: event
            }).then(this._mapRes).then((resJson) => {
                let ti = -1;
                for (let i in this.eventCaches.items) {
                    if (this.eventCaches.items[i].id === eventId) {
                        ti = i;
                        break;
                    }
                }

                if (ti >= 0) {
                    let gEvent = this.eventCaches.items[ti];
                    gEvent.updated = resJson.updated;
                    gEvent.summary = resJson.summary;
                    gEvent.description = resJson.description;
                    gEvent.sequence = resJson.sequence;
                    gEvent.start = resJson.start;
                    gEvent.end = resJson.end;
                    this.eventCaches.items[ti] = gEvent;
                }
                return resJson;
            });
        });
    }

    /**
     * @param {string} calendarId
     * @param {string} eventId
     */
    deleteEvent(calendarId, eventId) {
        return this.googleReady.then(() => {
            if (!this.isSignedIn) {
                return Promise.reject(new Error(GOOGLE_CLIENT_NOT_SIGNEDIN));
            }

            return window.gapi.client.calendar.events.delete({
                calendarId: calendarId,
                eventId: eventId
            }).then(this._mapRes).then((resJson) => {
                let ti = -1;
                for (let i in this.eventCaches.items) {
                    if (this.eventCaches.items[i].id === eventId) {
                        ti = i;
                        break;
                    }
                }

                if (ti >= 0) {
                    this.eventCaches.items.splice(ti, 1);
                }
                return resJson;
            });
        });
    }

    /**
     * @param {string[]} recurrence
     * @param {Date} [dtstart]
     * @param {number} [maxDates]
     */
    getEventDates(recurrence, dtstart = new Date(), maxDates = 250) {
        let rruleSet = new RRuleSet();
        let _dtstart = new Date(dtstart);
        _dtstart.setHours(0, 0, 0, 0);

        for (let i in recurrence) {
            let _rrule = rrulestr(recurrence[i]);
            let options = Object.assign({}, _rrule.options);
            if (null === options.freq) {
                continue;
            }

            // rrule.js 在 WEEKLY 的規則中處理有 bugs 因此轉為使用 DAILY 規則來達到相同結果
            options.freq === RRule.WEEKLY && (options.freq = RRule.DAILY);
            options.wkst = RRule.SU;
            options.byhour = options.byminute = options.bysecond = null;
            options.dtstart = _dtstart;

            let rrule = new RRule(options);
            rruleSet.rrule(rrule);
        }
        return rruleSet.all((d, len) => len <= maxDates);
    }

    _mapRes(res) {
        if (res.status >= 300) {
            return Promise.reject(new Error(res.status + ' ' + res.statusText));
        }
        return res.result;
    }
}

export default new GoogleCalendarHelper();
