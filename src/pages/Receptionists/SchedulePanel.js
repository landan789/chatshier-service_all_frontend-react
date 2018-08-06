import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import apiDatabase from '../../helpers/apiDatabase/index';
import { formatDate, formatTime } from '../../utils/unitTime';

import Calendar from '../../components/Calendar/Calendar';

import './SchedulePanel.css';

class SchedulePanel extends React.Component {
    static propTypes = {
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
        let appsReceptionists = nextProps.appsReceptionists[appId] || {};
        let receptionist = appsReceptionists.receptionists[receptionistId] || {};
        let schedules = receptionist.schedules || {};

        let calendarEvents = [];
        for (let scheduleId in schedules) {
            let schedule = schedules[scheduleId];
            let calendarEvent = {
                id: scheduleId,
                title: schedule.summary || '無標題',
                description: schedule.description || '無描述',
                start: new Date(schedule.start.dateTime),
                end: new Date(schedule.end.dateTime)
            };
            calendarEvents.push(calendarEvent);
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
        this.close = this.close.bind(this);

        this.state = Object.assign({
            animate: 'animated slideInUp',
            calendarEvents: []
        }, SchedulePanel.getDerivedStateFromProps(props, {}));
    }

    onSelectDate(start) {
        let startedDate = start.toDate();
        startedDate.setHours(0, 0, 0, 0);

        let endedDate = new Date(startedDate);
        endedDate.setHours(23, 59, 59, 999);

        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;
        let postSchedule = {
            summary: formatDate(startedDate),
            start: {
                dateTime: startedDate.getTime()
            },
            end: {
                dateTime: endedDate.getTime()
            },
            recurrence: ''
        };

        return apiDatabase.appsReceptionistsSchedules.insert(appId, receptionistId, postSchedule);
    }

    onEventClick(calendarData) {
        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;
        let scheduleId = calendarData.id;
        return apiDatabase.appsReceptionistsSchedules.delete(appId, receptionistId, scheduleId);
    }

    onEventDrop(calendarData, delta, revertFunc) {
        let startedDate = calendarData.start.toDate();
        let endedDate = calendarData.end ? calendarData.end.toDate() : startedDate;

        let appId = this.props.appId;
        let receptionistId = this.props.receptionistId;
        let scheduleId = calendarData.id;
        let putSchedule = {
            summary: formatDate(startedDate),
            description: '',
            start: {
                dateTime: startedDate.getTime()
            },
            end: {
                dateTime: endedDate.getTime()
            },
            recurrence: ''
        };

        return apiDatabase.appsReceptionistsSchedules.update(appId, receptionistId, scheduleId, putSchedule).catch(() => {
            return revertFunc();
        });
    }

    close() {
        return new Promise((resolve) => {
            this.setState({ animate: 'animated slideOutDown' });
            window.setTimeout(resolve, 300);
        }).then(this.props.onClose);
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
                <h5 className="ml-5 receptionist-name">服務人員名稱: {receptionist.name}</h5>}

                <Button className="p-2 border-circle close-btn" color="light" onClick={this.close}>
                    <i className="fas fa-times"></i>
                </Button>

                <Calendar className="p-5 chsr border-none"
                    events={this.state.calendarEvents}
                    onSelect={this.onSelectDate}
                    onEventClick={this.onEventClick}
                    onEventDrop={this.onEventDrop} />
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

export default connect(mapStateToProps)(SchedulePanel);
