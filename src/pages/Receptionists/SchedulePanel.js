import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { withTranslate } from '../../i18n';

import gcalendarHlp from '../../helpers/googleCalendar';

import Calendar from '../../components/Calendar/Calendar';
import ScheduleModal from '../../components/Modals/Schedule/Schedule';

import './SchedulePanel.css';

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

            let startedDateTime = new Date(schedule.start.dateTime);
            let endedDateTime = new Date(schedule.end.dateTime);
            let offset = endedDateTime.getTime() - startedDateTime.getTime();
            let hhStart = startedDateTime.getHours();
            let mmStart = startedDateTime.getMinutes();
            let ssStart = startedDateTime.getSeconds();
            let hhEnd = endedDateTime.getHours();
            let mmEnd = endedDateTime.getMinutes();
            let ssEnd = endedDateTime.getSeconds();

            let dates = gcalendarHlp.getEventDates(recurrence, startedDateTime);
            calendarEvents = calendarEvents.concat(dates.map((date) => {
                let _startedDateTime = new Date(date);
                _startedDateTime.setHours(hhStart, mmStart, ssStart);

                let _endedDateTime = new Date(date);
                _endedDateTime.setHours(hhEnd, mmEnd, ssEnd);
                _endedDateTime = new Date(_endedDateTime.getTime() + offset);

                return {
                    id: scheduleId,
                    title: schedule.summary || '無標題',
                    description: schedule.description || '無描述',
                    start: _startedDateTime,
                    end: _endedDateTime,
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

        this.onDateSelect = this.onDateSelect.bind(this);
        this.onEventClick = this.onEventClick.bind(this);

        this.hide = this.hide.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = Object.assign({
            animate: 'animated zoomIn',
            isAsyncProcessing: false,
            calendarEvents: []
        }, SchedulePanel.getDerivedStateFromProps(props, {}));
    }

    onDateSelect(start) {
        let dateNow = new Date();
        let startedDateTime = start.toDate();
        startedDateTime.setHours(dateNow.getHours(), 0, 0, 0);

        let endedDateTime = new Date(startedDateTime);
        endedDateTime.setHours(dateNow.getHours() + 1, 0, 0, 0);

        this.setState({
            schedule: {
                start: {
                    dateTime: startedDateTime
                },
                end: {
                    dateTime: endedDateTime
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

        let className = 'container schedule-panel ' + this.state.animate + ' ' + this.props.className;
        return (
            <div className={className.trim()}>
                {receptionist && receptionist.name &&
                <h5 className="ml-5 receptionist-name">服務人員行程 - {receptionist.name}</h5>}

                <Button className="p-2 border-circle close-btn" color="light" onClick={this.hide}>
                    <i className="fas fa-times"></i>
                </Button>

                <Calendar className="p-5 chsr border-none"
                    canEdit={false}
                    events={this.state.calendarEvents}
                    onSelect={this.onDateSelect}
                    onEventClick={this.onEventClick} />

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
