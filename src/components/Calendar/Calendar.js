import React from 'react';
import PropTypes from 'prop-types';
import { withTranslate, currentLanguage } from '../../i18n';

import $ from 'jquery';

import './Calendar.css';

class Calendar extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        className: PropTypes.string,
        events: PropTypes.array,
        onSelect: PropTypes.func,
        onEventClick: PropTypes.func,
        onEventDrop: PropTypes.func
    }

    static defaultProps = {
        className: '',
        events: []
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {JQuery<HTMLElement>} */
        this.$calendar = void 0;
        this.initCalendar = this.initCalendar.bind(this);

        this.state = {
            prevProps: null
        };
    }

    destroy() {
        if (!this.$calendar) {
            return;
        }
        this.$calendar.fullCalendar('destroy');
        delete this.$calendar;
    }

    initCalendar(refElem) {
        if (!refElem) {
            this.destroy();
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
                left: 'today, prev, next',
                center: 'title',
                right: 'month, agendaWeek, agendaDay'
            },
            height: '100%',
            defaultDate: new Date(), // The initial date displayed when the calendar first loads.
            editable: true, // true allow user to edit events.
            eventLimit: true, // allow "more" link when too many events
            selectable: true, // allows a user to highlight multiple days or timeslots by clicking and dragging.
            selectHelper: false, // whether to draw a "placeholder" event while the user is dragging.
            allDaySlot: false,
            // events is the main option for calendar.
            events: [],
            // execute after user select timeslots.
            select: this.props.onSelect,
            eventClick: this.props.onEventClick,
            eventDrop: this.props.onEventDrop,
            eventDurationEditable: true
        });
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        if (!this.$calendar) {
            return;
        }
        this.$calendar.fullCalendar('removeEvents');
        this.props.events.length > 0 && this.$calendar.fullCalendar('renderEvents', this.props.events, true);
    }

    render() {
        let className = this.props.className + ' card chsr calendar';
        return <div className={className.trim()} ref={this.initCalendar}></div>;
    }
}

export default withTranslate(Calendar);
