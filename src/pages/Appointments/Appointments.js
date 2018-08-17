import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card } from 'reactstrap';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import Calendar from '../../components/Calendar/Calendar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppointmentModal from '../../components/Modals/Appointment/Appointment';
import { notify } from '../../components/Notify/Notify';

import './Appointments.css';

class Appointments extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsAppointments: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        let appId = nextState.appId;
        if (!appId) {
            return nextState;
        }

        let appAppointments = nextProps.appsAppointments[appId] || {};
        let appointments = appAppointments.appointments || {};
        nextState.calendarEvents && (nextState.calendarEvents.length = 0);
        nextState.calendarEvents = Appointments.getCalendarEvents(appointments);
        return nextState;
    }

    /**
     * @param {Chatshier.Models.Appointments} appointments
     */
    static getCalendarEvents(appointments) {
        let calendarEvents = [];
        for (let appointmentId in appointments) {
            let appointment = appointments[appointmentId];
            let calendarEvent = {
                id: appointmentId,
                title: appointment.summary || '無標題',
                description: appointment.description || '無描述',
                start: new Date(appointment.startedTime),
                end: new Date(appointment.endedTime)
            };
            calendarEvents.push(calendarEvent);
        }
        return calendarEvents;
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHlp.setTitle(this.props.t('View Appointments'));
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.state = Object.assign({
            appId: ''
        }, Appointments.getDerivedStateFromProps(props, {}));

        this.onAppChange = this.onAppChange.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsAppointments.find(),
            apiDatabase.appsReceptionists.find(),
            apiDatabase.appsProducts.find(),
            apiDatabase.consumers.find()
        ]);
    }

    onEventClick(calendarData) {
        let appId = this.state.appId;
        let appointmentId = calendarData.id;
        /** @type {Chatshier.Models.Appointment} */
        let appointment = this.props.appsAppointments[appId].appointments[appointmentId];

        this.setState({
            appointmentId: appointmentId,
            appointment: appointment
        });
    }

    updateAppointment(appointmentId, appointment) {
        let appId = this.state.appId;

        let appAppointments = this.props.appsAppointments[appId] || { appointments: {} };
        let appointments = appAppointments.appointments;
        /** @type {Chatshier.Models.Appointment} */
        let _appointment = appointments[appointmentId];
        let putAppointment = Object.assign({}, _appointment, appointment);

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsAppointments.update(appId, appointmentId, putAppointment).then(() => {
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            appointmentId: void 0,
            appointment: void 0
        });
    }

    onAppChange(appId) {
        let appAppointments = this.props.appsAppointments[appId] || {};
        let appointments = appAppointments.appointments || {};
        let nextState = {
            appId: appId,
            calendarEvents: Appointments.getCalendarEvents(appointments)
        };
        this.setState(nextState);
    }

    render() {
        if (!this.state) {
            return null;
        }

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('View Appointments')}>
                    <Fade in className="align-items-center mt-5 pb-4 container category-wrapper">
                        <Card className="pb-3 shadow chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">檢視預約項目</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 檢視預約項目</p>
                                <p className="mb-3 pt-0 px-3 text-muted small">檢視所有已建立的預約</p>
                            </div>

                            <AppsSelector className="px-3 my-3" onChange={this.onAppChange} />

                            <div className="appointments-wrapper" ref={(elem) => (this.wrapperElem = elem)}>
                                <Calendar className="px-5 pb-3 chsr border-none"
                                    canEdit={false}
                                    agenda={['month', 'agendaWeek']}
                                    events={this.state.calendarEvents}
                                    onEventClick={this.onEventClick} />
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.appointment &&
                <AppointmentModal isOpen={!!this.state.appointment}
                    appId={this.state.appId}
                    appointmentId={this.state.appointmentId}
                    appointment={this.state.appointment}
                    close={this.closeModal} />}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsAppointments: storeState.appsAppointments
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Appointments)));
