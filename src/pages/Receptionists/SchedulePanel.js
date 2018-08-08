import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { withTranslate } from '../../i18n';

import apiDatabase from '../../helpers/apiDatabase/index';
import { RRule, RRuleSet, rrulestr } from 'rrule';

import Calendar from '../../components/Calendar/Calendar';
import ScheduleModal from '../../components/Modals/Schedule/Schedule';

import './SchedulePanel.css';

const MAX_DATES = 250;

class SchedulePanel extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        className: PropTypes.string,
        appId: PropTypes.string.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        receptionistId: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired
    }

    static defaultProps = {
        className: ''
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        let appId = nextProps.appId;
        let receptionistId = nextProps.receptionistId;
        let appReceptionists = nextProps.appsReceptionists[appId] || {};
        let receptionist = appReceptionists.receptionists[receptionistId] || {};
        /** @type {Chatshier.Models.Schedules} */
        let schedules = receptionist.schedules || {};

        let calendarEvents = [];
        for (let scheduleId in schedules) {
            let schedule = schedules[scheduleId];
            let recurrence = schedule.recurrence || [];

            if (!recurrence[0]) {
                let calendarEvent = {
                    id: scheduleId,
                    title: schedule.summary || '無標題',
                    description: schedule.description || '無描述',
                    start: new Date(schedule.start.dateTime),
                    end: new Date(schedule.end.dateTime),
                    isRecurrence: false
                };
                calendarEvents.push(calendarEvent);
                continue;
            }

            let startDateTime = new Date(schedule.start.dateTime);
            let endDateTime = new Date(schedule.end.dateTime);
            let hhStart = startDateTime.getHours();
            let mmStart = startDateTime.getMinutes();
            let ssStart = startDateTime.getSeconds();
            let hhEnd = endDateTime.getHours();
            let mmEnd = endDateTime.getMinutes();
            let ssEnd = endDateTime.getSeconds();

            let rruleSet = new RRuleSet();
            for (let i in recurrence) {
                let rrule = rrulestr(recurrence[i]);
                rrule.options.dtstart = new Date(startDateTime);
                rrule.options.dtstart.setHours(0, 0, 0, 0);
                rruleSet.rrule(rrule);
            }
            let allDates = rruleSet.all((d, len) => len <= MAX_DATES);

            calendarEvents = calendarEvents.concat(allDates.map((date) => {
                let _startDateTime = new Date(date);
                _startDateTime.setHours(hhStart, mmStart, ssStart);

                let _endDateTime = new Date(date);
                _endDateTime.setHours(hhEnd, mmEnd, ssEnd);

                return {
                    id: scheduleId,
                    title: schedule.summary || '無標題',
                    description: schedule.description || '無描述',
                    start: _startDateTime,
                    end: _endDateTime,
                    isRecurrence: true
                };
            }));
        }

        nextState.calendarEvents && (nextState.calendarEvents.length = 0);
        nextState.calendarEvents = calendarEvents;
        return nextState;
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.onSelectDate = this.onSelectDate.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onEventDrop = this.onEventDrop.bind(this);

        this.hide = this.hide.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = Object.assign({
            animate: 'animated zoomIn',
            isAsyncProcessing: false,
            calendarEvents: []
        }, SchedulePanel.getDerivedStateFromProps(props, {}));
    }

    onSelectDate(start) {
        let dateNow = new Date();
        let startDateTime = start.toDate();
        startDateTime.setHours(dateNow.getHours(), 0, 0, 0);

        let endDateTime = new Date(startDateTime);
        endDateTime.setHours(dateNow.getHours() + 1, 0, 0, 0);

        this.setState({
            schedule: {
                start: {
                    dateTime: startDateTime
                },
                end: {
                    dateTime: endDateTime
                }
            }
        });
    }

    onEventClick(calendarData) {
        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;
        let receptionist = this.props.appsReceptionists[appId].receptionists[receptionistId];

        let scheduleId = calendarData.id;
        let schedule = receptionist.schedules[scheduleId];

        this.setState({
            scheduleId: scheduleId,
            schedule: schedule
        });
    }

    onEventDrop(calendarData, delta, revertFunc) {
        let startedDate = calendarData.start.toDate();
        let endedDate = calendarData.end ? calendarData.end.toDate() : startedDate;

        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;
        let receptionist = this.props.appsReceptionists[appId].receptionists[receptionistId];

        let scheduleId = calendarData.id;
        let schedule = receptionist.schedules[scheduleId];

        let putSchedule = {};
        if (calendarData.isRecurrence) {
            let recurrence = (schedule.recurrence || []).filter((str) => !!str);
            let rruleSet = new RRuleSet();
            for (let i in recurrence) {
                let recurrenceStr = recurrence[i];
                rruleSet.rrule(RRule.fromString(recurrenceStr));
            }
            rruleSet.exdate(startedDate);
            rruleSet.rdate(endedDate);
            putSchedule.recurrence = rruleSet.valueOf();
        } else {
            putSchedule.start = {
                dateTime: startedDate.getTime()
            };

            putSchedule.end = {
                dateTime: endedDate.getTime()
            };
        }

        return apiDatabase.appsReceptionistsSchedules.update(appId, receptionistId, scheduleId, putSchedule).catch(() => {
            return revertFunc();
        });
    }

    hide() {
        return new Promise((resolve) => {
            this.setState({ animate: 'animated zoomOut' });
            window.setTimeout(resolve, 300);
        }).then(this.props.onClose);
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            schedule: void 0,
            scheduleId: void 0
        });
    }

    render() {
        let appId = this.props.appId;
        let appReceptionists = this.props.appsReceptionists[appId] || {};
        let receptionists = appReceptionists.receptionists || {};
        let receptionist = receptionists[this.props.receptionistId] || {};

        let className = 'schedule-panel ' + this.state.animate + ' ' + this.props.className;
        return (
            <div className={className.trim()}>
                {receptionist && receptionist.name &&
                <h5 className="ml-5 receptionist-name">服務人員行事曆 - {receptionist.name}</h5>}

                <Button className="p-2 border-circle close-btn" color="light" onClick={this.hide}>
                    <i className="fas fa-times"></i>
                </Button>

                <Calendar className="p-5 chsr border-none"
                    events={this.state.calendarEvents}
                    onSelect={this.onSelectDate}
                    onEventClick={this.onEventClick}
                    onEventDrop={this.onEventDrop} />

                {this.state.schedule &&
                <ScheduleModal
                    isOpen={!!this.state.schedule}
                    isUpdate={!!this.state.scheduleId}
                    appId={this.props.appId}
                    receptionistId={this.props.receptionistId}
                    scheduleId={this.state.scheduleId}
                    schedule={this.state.schedule}
                    close={this.closeModal} />}
            </div>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        appsReceptionists: storeState.appsReceptionists
    });
};

export default withTranslate(connect(mapStateToProps)(SchedulePanel));
