import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../../i18n';
import { connect } from 'react-redux';
import { DateTimePicker } from 'react-widgets';

import { Button, Modal, ModalHeader, ModalBody,
    FormGroup, CardDeck, Card } from 'reactstrap';

import ModalCore from '../ModalCore';
import apiDatabase from '../../../helpers/apiDatabase';
import { formatDate, formatTime } from '../../../utils/unitTime';
import confirmDialog from '../Confirm/Confirm';

import defaultProductImg from '../../../image/default-product.png';
import defaultConsumerImg from '../../../image/default-consumer.png';
import { notify } from '../../Notify/Notify';

import './Appointment.css';

class AppointmentModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsAppointments: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        consumers: PropTypes.object.isRequired,
        appId: PropTypes.string.isRequired,
        appointment: PropTypes.object.isRequired,
        appointmentId: PropTypes.string.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Models.Appointment} */
        let appointment = props.appointment || {};

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            summary: appointment.summary || '',
            description: appointment.description || '',
            startedDateTime: new Date(appointment.startedTime) || new Date(),
            endedDateTime: new Date(appointment.endedTime) || new Date()
        };

        this.removeAppointment = this.removeAppointment.bind(this);
    }

    removeAppointment(appointmentId) {
        return confirmDialog({
            title: '刪除確認',
            message: '確定要刪除這個預約嗎？',
            confirmText: this.props.t('Confirm'),
            confirmColor: 'danger',
            cancelText: this.props.t('Cancel')
        }).then((isConfirm) => {
            if (!isConfirm) {
                return;
            }

            let appId = this.state.appId;
            this.setState({ isAsyncProcessing: true });
            return apiDatabase.appsAppointments.delete(appId, appointmentId).then(() => {
                this.setState({ isAsyncProcessing: false });
                this.closeModal();
                return notify(this.props.t('Remove successful!'), { type: 'success' });
            }).catch(() => {
                this.setState({ isAsyncProcessing: false });
                return notify(this.props.t('An error occurred!'), { type: 'danger' });
            });
        });
    }

    render() {
        let appId = this.props.appId;
        /** @type {Chatshier.Models.Appointment} */
        let appointment = this.props.appointment;
        if (!(appId && appointment)) {
            return null;
        }

        let platformUid = appointment.platformUid;
        let receptionistId = appointment.receptionist_id;
        let productId = appointment.product_id;

        let appReceptionists = this.props.appsReceptionists[appId] || {};
        let receptionists = appReceptionists.receptionists || {};

        let appProducts = this.props.appsProducts[appId] || {};
        let products = appProducts.products || {};

        /** @type {Chatshier.Models.Receptionist} */
        let receptionist = receptionists[receptionistId];

        /** @type {Chatshier.Models.Product} */
        let product = products[productId];

        let consumers = this.props.consumers;
        /** @type {Chatshier.Models.Consumer} */
        let consumer = consumers[platformUid] || {};

        return (
            <Modal className="appointment-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey="View appointment" />
                </ModalHeader>

                <ModalBody>
                    <form>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Title" />:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder="無標題"
                                value={this.state.summary}
                                readOnly />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                預約關係:
                            </label>
                            <CardDeck className="mb-3 text-center">
                                <Card className="p-2">
                                    <label className="col-form-label font-weight-bold">預約人</label>
                                    <div className="m-auto image-container" style={{ width: '3rem', height: '3rem' }}>
                                        <img className="image-fit" src={consumer.photo || defaultConsumerImg} alt={consumer.name} />
                                    </div>
                                    <div className="w-100 text-muted small">{consumer.name}</div>
                                </Card>

                                {(product || receptionist) &&
                                <Card className="border-none">
                                    <div className="m-auto">
                                        <i className="fas fa-long-arrow-alt-right fa-2x"></i>
                                    </div>
                                </Card>}

                                {product &&
                                <Card className="p-2">
                                    <label className="col-form-label font-weight-bold">產品</label>
                                    <div className="m-auto image-container" style={{ width: '3rem', height: '3rem' }}>
                                        <img className="image-fit" src={product.src || defaultProductImg} alt={product.name} />
                                    </div>
                                    <div className="w-100 text-muted small">{product.name}</div>
                                </Card>}

                                {receptionist &&
                                <Card className="p-2">
                                    <label className="col-form-label font-weight-bold">服務人員</label>
                                    <div className="m-auto image-container" style={{ width: '3rem', height: '3rem' }}>
                                        <img className="image-fit" src={receptionist.photo || defaultConsumerImg} alt={receptionist.name} />
                                    </div>
                                    <div className="w-100 text-muted small">{receptionist.name}</div>
                                </Card>}
                            </CardDeck>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Start datetime" />:
                            </label>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                defaultValue={this.state.startedDateTime}
                                readOnly>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="End datetime" />:
                            </label>
                            <DateTimePicker
                                culture={currentLanguage}
                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                timeFormat={(time) => formatTime(time, false)}
                                defaultValue={this.state.endedDateTime}
                                readOnly>
                            </DateTimePicker>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                預約資料:
                            </label>
                            <Card className="p-2"
                                dangerouslySetInnerHTML={{ __html: (this.state.description || '無說明').replace(/\n/g, '<br />') }} />
                        </FormGroup>

                        <div className="d-flex align-items-center justify-content-end">
                            <Button className="mr-1" type="button" color="danger"
                                onClick={this.removeAppointment}
                                disabled={this.state.isAsyncProcessing}>
                                刪除預約
                            </Button>

                            <Button className="ml-1" type="button" color="secondary" onClick={this.closeModal}>
                                <Trans i18nKey="Cancel" />
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        appsAppointments: storeState.appsAppointments,
        appsReceptionists: storeState.appsReceptionists,
        appsProducts: storeState.appsProducts,
        consumers: storeState.consumers
    });
};

export default withTranslate(connect(mapStateToProps)(AppointmentModal));
