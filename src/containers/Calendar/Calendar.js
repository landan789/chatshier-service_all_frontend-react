import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import { notify } from '../../components/Notify/Notify';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import CalendarInsertModal from '../../components/Modals/CalendarInsert/CalendarInsert';
import CalendarEditModal, { CalendarEventTypes } from '../../components/Modals/CalendarEdit/CalendarEdit';
import TicketEditModal from '../../components/Modals/TicketEdit/TicketEdit';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/locale/zh-tw';
import 'fullcalendar/dist/fullcalendar.min.css';
import './Calendar.css';

class CalendarEventItem {
    constructor(options) {
        options = options || {};
        // 目前只設定使用到的項目，並無全部都設定
        // 參考: https://fullcalendar.io/docs/event_data/Event_Object/
        this.calendarId = options.calendarId || '';
        this.id = options.id || '';
        this.eventType = CalendarEventTypes.CALENDAR;
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
        this.eventType = CalendarEventTypes.TICKET;
        this.backgroundColor = '#c7e6c7';
        this.borderColor = '#c7e6c7';
        this.textColor = '#6e6e6e';
    }
}

// class GoogleEventItem extends CalendarEventItem {
//     constructor(options) {
//         options = options || {};
//         super(options);
//         this.eventType = CalendarEventTypes.GOOGLE;
//         this.backgroundColor = '#468af5';
//         this.borderColor = '#468af5';
//         this.textColor = '#efeff0';
//     }
// }

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            insertModalData: null,
            editModalData: null
        };

        /** @type {JQuery<HTMLElement>} */
        this.$calendar = null;

        this.initCalendar = this.initCalendar.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onEventDrop = this.onEventDrop.bind(this);
        this.updateCalendarEvent = this.updateCalendarEvent.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('行事曆');

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            dbapi.calendarsEvents.find(userId),
            dbapi.appsTickets.find(null, userId),
            dbapi.consumers.find(userId)
        ]);
    }

    componentWillReceiveProps(props) {
        this.reload(props);
    }

    reload(props) {
        this.$calendar.fullCalendar('removeEvents');
        this.reloadCalendarEvents(props.calendarsEvents);
        this.reloadAppsTickets(props.appsTickets);
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

    onSelectDate(start, end) {
        let startDateTime = start.toDate();
        startDateTime.setHours(0, 0, 0, 0);
        let endDateTime = new Date(startDateTime);
        endDateTime.setDate(endDateTime.getDate() + 1);

        let modalData = {
            startDateTime: startDateTime,
            endDateTime: endDateTime
        };
        this.setState({ insertModalData: modalData });
    }

    onEventClick(calendarEvent) {
        let origin = calendarEvent.origin;

        if (CalendarEventTypes.TICKET === calendarEvent.eventType) {
            let appId = calendarEvent.calendarId;
            let ticketId = calendarEvent.id;
            /** @type {Chatshier.Ticket} */
            let ticket = origin;
            /** @type {Chatshier.Consumers} */
            let consumers = this.props.consumers;
            let consumer = consumers[ticket.platformUid];

            let modalData = {
                appId: appId,
                ticketId: ticketId,
                ticket: origin,
                consumer: consumer
            };
            this.setState({ editTicketData: modalData });
        } else {
            /** @type {Chatshier.CalendarEvent} */
            let event = {
                title: calendarEvent.title,
                description: calendarEvent.description,
                isAllDay: calendarEvent.isAllDay,
                startedTime: origin.startedTime,
                endedTime: origin.endedTime
            };

            let modalData = {
                calendarId: calendarEvent.calendarId,
                eventId: calendarEvent.id,
                eventType: calendarEvent.eventType,
                event: event
            };
            this.setState({ editModalData: modalData });
        }
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
        return this.updateCalendarEvent(calendarId, eventId, eventType, event).catch(() => {
            revertFunc();
        });
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
            case CalendarEventTypes.CALENDAR:
                return dbapi.calendarsEvents.update(calendarId, eventId, userId, event);
            case CalendarEventTypes.TICKET:
                /** @type {Chatshier.Ticket} */
                let ticket = {
                    description: event.description,
                    dueTime: event.endedTime
                };
                return dbapi.appsTickets.update(calendarId, eventId, userId, ticket);
            // case CalendarEventTypes.GOOGLE:
            //     let dateFormatOpts = {
            //         year: 'numeric',
            //         month: '2-digit',
            //         day: '2-digit'
            //     };

            //     let gEvent = {
            //         summary: calendar.title,
            //         description: calendar.description,
            //         start: {
            //             date: calendar.isAllDay ? new Date(calendar.startedTime).toLocaleDateString('zh', dateFormatOpts).replace(/\//g, '-') : void 0,
            //             dateTime: !calendar.isAllDay ? new Date(calendar.startedTime).toJSON() : void 0
            //         },
            //         end: {
            //             date: calendar.isAllDay ? new Date(calendar.endedTime).toLocaleDateString('zh', dateFormatOpts).replace(/\//g, '-') : void 0,
            //             dateTime: !calendar.isAllDay ? new Date(calendar.endedTime).toJSON() : void 0
            //         }
            //     };

            //     return window.googleCalendarHelper.updateEvent('primary', eventId, gEvent).then((googleEvent) => {
            //         let isAllDay = !!(googleEvent.start.date && googleEvent.end.date);
            //         let startDate = isAllDay ? new Date(googleEvent.start.date) : new Date(googleEvent.start.dateTime);
            //         isAllDay && startDate.setHours(0, 0, 0, 0);
            //         let endDate = isAllDay ? new Date(googleEvent.end.date) : new Date(googleEvent.end.dateTime);
            //         isAllDay && endDate.setHours(0, 0, 0, 0);

            //         let eventItem = new GoogleEventItem({
            //             calendarId: googleEvent.iCalUID,
            //             id: eventId,
            //             title: googleEvent.summary,
            //             description: googleEvent.description,
            //             start: startDate,
            //             end: endDate,
            //             origin: googleEvent
            //         });
            //         this.$calendar.fullCalendar('updateEvent', eventItem, true);
            //     });
            default:
                return Promise.reject(new Error('UNKNOWN_EVENT_TYPE'));
        }
    }

    closeInsertModal(ev) {
        this.setState({ insertModalData: null });
    }

    closeEditModal(ev) {
        this.setState({
            editModalData: null,
            editTicketData: null
        });
    }

    initCalendar(refElem) {
        if (!refElem && this.$calendar) {
            this.$calendar.fullCalendar('destroy');
            delete this.$calendar;
            return;
        }

        this.$calendar = $(refElem);
        this.$calendar.fullCalendar({
            locale: 'zh-tw',
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
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
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
        this.reload(this.props);
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar calendar-wrapper">
                    <div className="chsr calendar" ref={this.initCalendar}></div>
                </Fade>
                <CalendarInsertModal
                    modalData={this.state.insertModalData}
                    isOpen={!!this.state.insertModalData}
                    close={this.closeInsertModal}>
                </CalendarInsertModal>
                <CalendarEditModal
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    updateHandle={this.updateCalendarEvent}
                    close={this.closeEditModal}>
                </CalendarEditModal>
                <TicketEditModal
                    modalData={this.state.editTicketData}
                    isOpen={!!this.state.editTicketData}
                    close={this.closeEditModal}>
                </TicketEditModal>
            </Aux>
        );
    }
}

Calendar.propTypes = {
    consumers: PropTypes.object,
    appsTickets: PropTypes.object,
    calendarsEvents: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        consumers: state.consumers,
        appsTickets: state.appsTickets,
        calendarsEvents: state.calendarsEvents
    };
};

export default withRouter(connect(mapStateToProps)(Calendar));
