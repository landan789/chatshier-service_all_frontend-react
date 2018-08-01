import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card } from 'reactstrap';
import { withTranslate } from '../../i18n';

import apiDatabase from '../../helpers/apiDatabase/index';

import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';

import './Appointments.css';

class Appointments extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsAppointments: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: ''
        };
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsAppointments.find()
        ]);
    }

    updateAppointment(appointmentId) {
        let appointment = {};

        let appId = this.state.appId;
        return apiDatabase.appsAppointments.update(appId, appointmentId, appointment);
    }

    deleteAppointment(appointmentId) {
        let appId = this.state.appId;
        return apiDatabase.appsAppointments.delete(appId, appointmentId);
    }

    render() {
        let appId = this.state.appId;
        let appAppointments = this.props.appsAppointments[appId] || { appointments: {} };
        /** @type {Chatshier.Models.Appointments} */
        let appointments = appAppointments.appointments;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Appointment management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">檢視預約項目</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 檢視預約項目</p>
                                <p className="mb-3 pt-0 px-3">檢視所有已建立的預約</p>
                            </div>
                            <AppsSelector className="px-3 my-3" onChange={(_appId) => this.setState({ appId: _appId })} />

                            <div className="appointments-wrapper">
                                {Object.keys(appointments).map((appointmentId) => {
                                    let appointment = appointments[appointmentId];
                                    return (
                                        <Aux key={appointmentId}>
                                            <div>platformUid: {appointment.platformUid}</div>
                                            <div>receptionist_id: {appointment.receptionist_id}</div>
                                            <div>startedTime: {appointment.startedTime}</div>
                                            <div>endedTime: {appointment.endedTime}</div>
                                            <Button color="primary" onClick={() => this.updateAppointment(appointmentId)}>更新預約</Button>
                                            <Button color="danger" onClick={() => this.deleteAppointment(appointmentId)}>刪除預約</Button>
                                        </Aux>
                                    );
                                })}
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>
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
