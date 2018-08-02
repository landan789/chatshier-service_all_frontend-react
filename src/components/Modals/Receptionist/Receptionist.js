import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap';

import ModalCore from '../ModalCore';
import apiDatabase from '../../../helpers/apiDatabase';
import { HOUR } from '../../../utils/unitTime';
import regex from '../../../utils/regex';

class ReceptionistModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        receptionistId: PropTypes.string,
        receptionist: PropTypes.object,
        insertHandler: PropTypes.func.isRequired,
        updateHandler: PropTypes.func.isRequired,
        deleteHandler: PropTypes.func.isRequired,
        onAppChange: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Models.Receptionist} */
        let receptionist = props.receptionist || {};

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            name: receptionist.name || '',
            gmail: receptionist.gmail || '',
            interval: receptionist.interval || HOUR,
            maxNumber: receptionist.maxNumber || 0,
            schedules: receptionist.schedules || []
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let receptionist = {
            name: this.state.name,
            gmail: this.state.gmail,
            interval: this.state.interval,
            maxNumber: this.state.maxNumber,
            schedules: this.state.schedules
        };
        return this.props.isUpdate ? this.props.updateHandler(this.props.receptionistId, receptionist) : this.props.insertHandler(receptionist);
    }

    onAppChange(ev) {
        this.setState({ appId: ev.target.value });
        return this.props.onAppChange(ev.target.value);
    }

    render() {
        if (!this.props.receptionist) {
            return null;
        }

        return (
            <Modal className="receptionist-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit receptionist' : 'Add receptionist'} />
                </ModalHeader>

                <ModalBody>
                    <form onSubmit={this.onSubmitForm}>
                        {!this.props.isUpdate &&
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Bot" />:
                            </label>
                            <select className="form-control"
                                value={this.state.appId}
                                onChange={this.onAppChange}
                                required>
                                {Object.keys(this.props.apps).map((appId) => {
                                    /** @type {Chatshier.Models.App} */
                                    let app = this.props.apps[appId];
                                    if (apiDatabase.apps.TYPES.CHATSHIER === app.type) {
                                        return null;
                                    }
                                    return <option key={appId} value={appId}>{app.name}</option>;
                                })}
                            </select>
                        </FormGroup>}

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {!this.props.isUpdate && <span className="mr-1 text-danger">*</span>}
                                <Trans i18nKey="Name" />:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder={this.props.t('Fill the receptionist\'s name')}
                                value={this.state.name}
                                maxLength={50}
                                onChange={(ev) => this.setState({ name: ev.target.value })}
                                required />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {!this.props.isUpdate && <span className="mr-1 text-danger">*</span>}
                                Gmail:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder={this.props.t('Fill the receptionist\'s Gmail')}
                                value={this.state.gmail}
                                pattern={regex.emailWeak.source}
                                maxLength={50}
                                onChange={(ev) => this.setState({ gmail: ev.target.value })}
                                required />
                        </FormGroup>

                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold">預約間隔 (小時):</label>
                            <input className="form-control"
                                type="number"
                                placeholder={1.0}
                                value={Math.floor(((this.state.interval || HOUR) / HOUR) * 10) / 10}
                                min={1.0}
                                max={24.0}
                                step={0.5}
                                onChange={(ev) => this.setState({ interval: ev.target.value * HOUR })} />
                        </FormGroup>

                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold">預約數上限:</label>
                            <input className="form-control"
                                type="number"
                                placeholder={0}
                                value={this.state.maxNumber || 0}
                                min={0}
                                max={100000000}
                                step={1}
                                onChange={(ev) => this.setState({ maxNumber: ev.target.value })} />
                        </FormGroup>

                        <div className="d-flex align-items-center justify-content-end">
                            {!this.props.isUpdate &&
                            <Button className="mr-1" type="submit" color="primary"
                                disabled={this.state.isAsyncWorking}>
                                <Trans i18nKey="Add" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="submit" color="primary"
                                disabled={this.state.isAsyncWorking}>
                                <Trans i18nKey="Update" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="button" color="danger"
                                onClick={() => this.props.deleteHandler && this.props.deleteHandler(this.props.receptionistId)}
                                disabled={this.state.isAsyncWorking}>
                                <Trans i18nKey="Remove" />
                            </Button>}

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
        apps: storeState.apps,
        appsReceptionists: storeState.appsReceptionists
    });
};

export default withTranslate(connect(mapStateToProps)(ReceptionistModal));
