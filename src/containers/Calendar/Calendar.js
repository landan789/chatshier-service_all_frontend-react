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

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/locale/zh-tw';
import 'fullcalendar/dist/fullcalendar.min.css';
import './Calendar.css';

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.initCalendar = this.initCalendar.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onEventDrop = this.onEventDrop.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('行事曆');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;
            return userId && Promise.all([
                dbapi.calendarsEvents.findAll(userId),
                dbapi.appsTickets.findAll(null, userId)
            ]);
        });
    }

    onSelectDate(start, end) {

    }

    onEventClick(event) {

    }

    onEventDrop(event, delta, revertFunc) {

    }

    initCalendar(refElem) {
        let $calendar = $(refElem);
        $calendar.fullCalendar({
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
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar calendar-wrapper">
                    <div className="chsr calendar" ref={this.initCalendar}>
                    </div>
                </Fade>
            </Aux>
        );
    }
}

Calendar.propTypes = {
    appsTickets: PropTypes.object,
    calendarsEvents: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        appsTickets: state.appsTickets,
        calendarsEvents: state.calendarsEvents
    };
};

export default withRouter(connect(mapStateToProps)(Calendar));
