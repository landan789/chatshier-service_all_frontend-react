import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade } from 'reactstrap';
import { withTranslate, currentLanguage } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';
import gCalendarHelper from '../../helpers/googleCalendar';
import { formatDate } from '../../utils/unitTime';

import { notify } from '../../components/Notify/Notify';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import CalendarModal from '../../components/Modals/Calendar/Calendar';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/locale/zh-tw';
import 'fullcalendar/dist/fullcalendar.min.css';
import './Calendar.css';

const CALENDAR_EVENT_TYPES = Object.freeze({
    CALENDAR: 'CALENDAR',
    GOOGLE: 'GOOGLE',
    TICKET: 'TICKET'
});

class CalendarEventItem {
    constructor(options) {
        options = options || {};
        // 目前只設定使用到的項目，並無全部都設定
        // 參考: https://fullcalendar.io/docs/event_data/Event_Object/
        this.calendarId = options.calendarId || '';
        this.id = options.id || '';
        this.eventType = CALENDAR_EVENT_TYPES.CALENDAR;
        this.title = options.title || '';
        this.description = options.description || '';
        this.isAllDay = !!options.isAllDay;
        this.start = options.start || null;
        this.end = options.end || null;
        this.origin = options.origin || {};

        this.backgroundColor = '#90b5c7';
        this.borderColor = '#90b5c7';
        this.textColor = '#efefef';
    }
}

class TicketEventItem extends CalendarEventItem {
    constructor(options) {
        options = options || {};
        super(options);
        this.eventType = CALENDAR_EVENT_TYPES.TICKET;
        this.backgroundColor = '#c7e6c7';
        this.borderColor = '#c7e6c7';
        this.textColor = '#6e6e6e';
    }
}

class GoogleEventItem extends CalendarEventItem {
    constructor(options) {
        options = options || {};
        super(options);
        this.eventType = CALENDAR_EVENT_TYPES.GOOGLE;
        this.backgroundColor = '#468af5';
        this.borderColor = '#468af5';
        this.textColor = '#efeff0';
    }
}

class Calendar extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        consumers: PropTypes.object,
        appsTickets: PropTypes.object,
        calendarsEvents: PropTypes.object,
        groups: PropTypes.object,
        users: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        /** @type {Chatshier.Model.Apps} */
        let apps = nextProps.apps;
        /** @type {Chatshier.Model.Groups} */
        let groups = nextProps.groups;
        /** @type {Chatshier.Model.Users} */
        let users = nextProps.users;

        // 每個 app 因群組不同，指派人清單也會不同，因此須根據群組準備指派人清單
        if (Object.keys(apps).length > 0 &&
            Object.keys(groups).length > 0 &&
            Object.keys(users).length > 0) {
            let appsAgents = {};
            for (let appId in apps) {
                for (let groupId in groups) {
                    let group = groups[groupId];
                    if (group.app_ids.indexOf(appId) < 0) {
                        continue;
                    }

                    appsAgents[appId] = { agents: {} };
                    for (let memberId in group.members) {
                        let memberUserId = group.members[memberId].user_id;
                        appsAgents[appId].agents[memberUserId] = {
                            name: users[memberUserId].name,
                            email: users[memberUserId].email
                        };
                    }
                }
            }
            nextState.appsAgents = appsAgents;
        }
        return nextState;
    }

    constructor(props) {
        super(props);

        /** @type {JQuery<HTMLElement>} */
        this.$calendar = void 0;

        this.gSignListenerId = void 0;

        this.initCalendar = this.initCalendar.bind(this);
        this.onGoogleSignChange = this.onGoogleSignChange.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onEventDrop = this.onEventDrop.bind(this);
        this.updateCalendarEvent = this.updateCalendarEvent.bind(this);
        this.closeCalendarModal = this.closeCalendarModal.bind(this);
        this.closeTicketModal = this.closeTicketModal.bind(this);

        browserHelper.setTitle(this.props.t('Calendar'));
        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }

        this.state = Object.assign({
            prevProps: null,
            insertModalData: void 0,
            editModalData: void 0,
            appsAgents: {}
        }, Calendar.getDerivedStateFromProps(props, {}));
    }

    componentDidMount() {
        this.gSignListenerId = gCalendarHelper.addSignChangeListener(this.onGoogleSignChange);

        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsTickets.find(),
            apiDatabase.calendarsEvents.find(),
            apiDatabase.consumers.find(),
            apiDatabase.groups.find(),
            apiDatabase.users.find(),
            gCalendarHelper.loadCalendarApi().then(() => gCalendarHelper.findEvents())
        ]).catch(() => {});
    }

    componentDidUpdate() {
        this.reload();
    }

    componentWillUnmount() {
        gCalendarHelper.removeSignChangeListener(this.gSignListenerId);
        this.gSignListenerId = void 0;
    }

    reload() {
        if (!this.$calendar) {
            return;
        }
        this.$calendar.fullCalendar('removeEvents');
        this.reloadCalendarEvents(this.props.calendarsEvents);
        this.reloadAppsTickets(this.props.appsTickets);
        this.reloadGoogleCalendar(gCalendarHelper.eventCaches.items);
    }

    reloadCalendarEvents(calendars) {
        let calendarEventList = [];

        for (let calendarId in calendars) {
            let events = calendars[calendarId].events;
            for (let eventId in events) {
                let event = events[eventId];
                if (event.isDeleted) {
                    continue; // 如果此行事曆事件已被刪除，則忽略不處理
                }

                let eventItem = new CalendarEventItem({
                    calendarId: calendarId,
                    id: eventId,
                    title: event.title,
                    description: event.description,
                    isAllDay: event.isAllDay,
                    start: new Date(event.startedTime),
                    end: new Date(event.endedTime),
                    origin: event
                });
                calendarEventList.push(eventItem);
            }
        }

        if (calendarEventList.length > 0) {
            this.$calendar.fullCalendar('renderEvents', calendarEventList, true);
        }
    }

    reloadAppsTickets(appsTickets) {
        let calendarEventList = [];

        for (let appId in appsTickets) {
            let tickets = appsTickets[appId].tickets;

            for (let ticketId in tickets) {
                let ticket = tickets[ticketId];
                if (ticket.isDeleted) {
                    continue;
                }

                // 由於待辦事項的資料項目與行事曆元件的數據項目不相同，因此需要進行轉換
                let eventItem = new TicketEventItem({
                    calendarId: appId,
                    id: ticketId,
                    // 待辦事項的標題以描述的前10個字顯示之
                    title: ticket.description.length > 10 ? ticket.description.substring(0, 10) : ticket.description,
                    description: ticket.description,
                    isAllDay: false,
                    start: new Date(ticket.createdTime),
                    end: new Date(ticket.dueTime),
                    origin: ticket
                });
                calendarEventList.push(eventItem);
            }
        }

        if (calendarEventList.length > 0) {
            this.$calendar.fullCalendar('renderEvents', calendarEventList, true);
        }
    }

    reloadGoogleCalendar(gCalendarItems) {
        let calendarEventList = gCalendarItems.map((googleEvent) => {
            let isAllDay = !!(googleEvent.start.date && googleEvent.end.date);
            let startDate = isAllDay ? new Date(googleEvent.start.date) : new Date(googleEvent.start.dateTime);
            isAllDay && startDate.setHours(0, 0, 0, 0);
            let endDate = isAllDay ? new Date(googleEvent.end.date) : new Date(googleEvent.end.dateTime);
            isAllDay && endDate.setHours(0, 0, 0, 0);

            return new GoogleEventItem({
                // calendarId: googleEvent.iCalUID,
                calendarId: 'primary',
                id: googleEvent.id,
                title: googleEvent.summary,
                description: googleEvent.description,
                isAllDay: isAllDay,
                start: startDate,
                end: endDate,
                origin: googleEvent
            });
        });

        if (calendarEventList.length > 0) {
            this.$calendar.fullCalendar('renderEvents', calendarEventList, true);
        }
    }

    onGoogleSignChange(isSignedIn) {
        if (!isSignedIn) {
            return this.reload();
        }

        return gCalendarHelper.findEvents().catch(() => {
            return gCalendarHelper.eventCaches;
        }).then(() => {
            this.reload();
        });
    }

    onSelectDate(start, end) {
        let startedTime = start.toDate();
        startedTime.setHours(0, 0, 0, 0);
        let endedTime = new Date(startedTime);
        endedTime.setDate(endedTime.getDate() + 1);

        let calendarData = {
            event: {
                startedTime: startedTime,
                endedTime: endedTime
            }
        };
        this.setState({ calendarData: calendarData });
    }

    onEventClick(calendarEvent) {
        let origin = calendarEvent.origin;

        if (CALENDAR_EVENT_TYPES.TICKET === calendarEvent.eventType) {
            let appId = calendarEvent.calendarId;
            let ticketId = calendarEvent.id;
            /** @type {Chatshier.Model.Ticket} */
            let ticket = origin;
            /** @type {Chatshier.Model.Consumers} */
            let consumers = this.props.consumers;
            let consumer = consumers[ticket.platformUid];

            let ticketData = {
                appId: appId,
                ticketId: ticketId,
                ticket: origin,
                consumer: consumer
            };
            this.setState({ ticketData: ticketData });
            return;
        }

        /** @type {Chatshier.CalendarEvent} */
        let event = {
            title: calendarEvent.title,
            description: calendarEvent.description,
            isAllDay: calendarEvent.isAllDay,
            startedTime: origin.startedTime || calendarEvent.start.toDate(),
            endedTime: origin.endedTime || calendarEvent.end.toDate()
        };

        let calendarData = {
            calendarId: calendarEvent.calendarId,
            eventId: calendarEvent.id,
            eventType: calendarEvent.eventType,
            event: event,
            origin: origin
        };
        this.setState({ calendarData: calendarData });
    }

    onEventDrop(calendarEvent, delta, revertFunc) {
        let startDate = calendarEvent.start.toDate();
        let endDate = calendarEvent.end ? calendarEvent.end.toDate() : startDate;

        /** @type {Chatshier.CalendarEvent} */
        let event = {
            title: calendarEvent.title,
            description: calendarEvent.description,
            startedTime: startDate.getTime(),
            endedTime: endDate.getTime(),
            isAllDay: calendarEvent.isAllDay ? 1 : 0
        };

        if (event.startedTime > event.endedTime) {
            revertFunc();
            return notify('開始時間需早於結束時間', { type: 'warning' });
        }

        let calendarId = event.calendarId;
        let eventId = event.id;
        let eventType = event.eventType;
        return this.updateCalendarEvent(calendarId, eventId, eventType, event).catch(() => revertFunc());
    }

    updateCalendarEvent(calendarId, eventId, eventType, event) {
        if (event.startedTime > event.endedTime) {
            return notify('開始時間需早於結束時間', { type: 'warning' }).then(() => {
                return Promise.reject(new Error('INVALID_DATE'));
            });
        }

        // 根據事件型態來判斷發送不同 API 進行資料更新動作
        let userId = authHelper.userId;
        switch (eventType) {
            case CALENDAR_EVENT_TYPES.CALENDAR:
                return apiDatabase.calendarsEvents.update(calendarId, eventId, userId, event);
            case CALENDAR_EVENT_TYPES.TICKET:
                /** @type {Chatshier.Model.Ticket} */
                let ticket = {
                    description: event.description,
                    dueTime: event.endedTime
                };
                return apiDatabase.appsTickets.update(calendarId, eventId, userId, ticket);
            case CALENDAR_EVENT_TYPES.GOOGLE:
                let gEvent = {
                    summary: event.title,
                    description: event.description,
                    start: {
                        date: event.isAllDay ? formatDate(event.startedTime) : void 0,
                        dateTime: !event.isAllDay ? new Date(event.startedTime).toJSON() : void 0
                    },
                    end: {
                        date: event.isAllDay ? formatDate(event.endedTime) : void 0,
                        dateTime: !event.isAllDay ? new Date(event.endedTime).toJSON() : void 0
                    }
                };

                return gCalendarHelper.updateEvent('primary', eventId, gEvent).then((googleEvent) => {
                    let isAllDay = !!(googleEvent.start.date && googleEvent.end.date);
                    let startDate = isAllDay ? new Date(googleEvent.start.date) : new Date(googleEvent.start.dateTime);
                    isAllDay && startDate.setHours(0, 0, 0, 0);
                    let endDate = isAllDay ? new Date(googleEvent.end.date) : new Date(googleEvent.end.dateTime);
                    isAllDay && endDate.setHours(0, 0, 0, 0);

                    let eventItem = new GoogleEventItem({
                        calendarId: googleEvent.iCalUID,
                        id: eventId,
                        title: googleEvent.summary,
                        description: googleEvent.description,
                        start: startDate,
                        end: endDate,
                        origin: googleEvent
                    });
                    this.$calendar.fullCalendar('updateEvent', eventItem, true);
                });
            default:
                return Promise.reject(new Error('UNKNOWN_EVENT_TYPE'));
        }
    }

    closeCalendarModal() {
        this.setState({ calendarData: null });
    }

    closeTicketModal() {
        this.setState({ ticketData: null });
    }

    initCalendar(refElem) {
        if (!refElem && this.$calendar) {
            this.$calendar.fullCalendar('destroy');
            delete this.$calendar;
            return;
        }

        this.$calendar = $(refElem);
        this.$calendar.fullCalendar({
            locale: currentLanguage,
            timezone: 'local',
            themeSystem: 'bootstrap4',
            bootstrapFontAwesome: {
                close: 'fa-times',
                prev: 'fa-chevron-left',
                next: 'fa-chevron-right',
                prevYear: 'fa-angle-double-left',
                nextYear: 'fa-angle-double-right'
            },
            // Defines the buttons and title position which is at the top of the calendar.
            header: {
                left: 'prev, today, next',
                center: 'title',
                right: 'month, agendaWeek, agendaDay'
            },
            height: 'auto',
            defaultDate: new Date(), // The initial date displayed when the calendar first loads.
            editable: true, // true allow user to edit events.
            eventLimit: true, // allow "more" link when too many events
            selectable: true, // allows a user to highlight multiple days or timeslots by clicking and dragging.
            selectHelper: true, // whether to draw a "placeholder" event while the user is dragging.
            allDaySlot: false,
            // events is the main option for calendar.
            events: [],
            // execute after user select timeslots.
            select: this.onSelectDate,
            eventClick: this.onEventClick,
            eventDrop: this.onEventDrop,
            eventDurationEditable: true
        });
        this.reload(this.props.calendarsEvents, this.props.appsTickets);
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Calendar')}>
                    <Fade in className="container mt-5 calendar-wrapper">
                        <div className="mb-5 card chsr calendar" ref={this.initCalendar}></div>
                    </Fade>
                </PageWrapper>

                {!!this.state.calendarData &&
                <CalendarModal
                    calendarData={this.state.calendarData}
                    isOpen={!!this.state.calendarData}
                    isUpdate={!!this.state.calendarData.eventId}
                    close={this.closeCalendarModal}>
                </CalendarModal>}

                {!!this.state.ticketData &&
                <TicketEditModal
                    appsAgents={this.state.appsAgents}
                    modalData={this.state.ticketData}
                    isOpen={!!this.state.ticketData}
                    isUpdate={!!this.state.ticketData.ticketId}
                    close={this.closeTicketModal}>
                </TicketEditModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsTickets: storeState.appsTickets,
        consumers: storeState.consumers,
        calendarsEvents: storeState.calendarsEvents,
        groups: storeState.groups,
        users: storeState.users
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Calendar)));

export { CALENDAR_EVENT_TYPES, CalendarEventItem, TicketEventItem, GoogleEventItem };
