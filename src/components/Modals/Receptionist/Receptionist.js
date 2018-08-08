import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap';

import ModalCore from '../ModalCore';
import CHATSHIER_CFG from '../../../config/chatshier';
import apiDatabase from '../../../helpers/apiDatabase';
import { blobToBase64 } from '../../../utils/common';
import { HOUR } from '../../../utils/unitTime';
import regex from '../../../utils/regex';

import defaultAvatarPng from '../../../image/default-avatar.png';
import { notify } from '../../Notify/Notify';

import './Receptionist.css';

class ReceptionistModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        receptionistId: PropTypes.string,
        receptionist: PropTypes.object.isRequired,
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
            photo: receptionist.photo || '',
            email: receptionist.email || '',
            interval: receptionist.interval || HOUR,
            maxNumber: receptionist.maxNumber || 0,
            schedules: receptionist.schedules || []
        };

        this._isMounted = false;
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let receptionist = {
            name: this.state.name,
            photo: (this.fileInput && this.fileInput.files.item(0)) || this.state.photo,
            email: this.state.email,
            interval: this.state.interval,
            maxNumber: this.state.maxNumber,
            schedules: this.state.schedules
        };

        this.setState({ isAsyncProcessing: true });
        return Promise.resolve().then(() => {
            if (this.props.isUpdate) {
                return this.props.updateHandler(this.props.receptionistId, receptionist);
            }
            return this.props.insertHandler(receptionist);
        }).then(() => {
            this._isMounted && this.setState({ isAsyncProcessing: false });
        });
    }

    onAppChange(ev) {
        this.setState({ appId: ev.target.value });
        return this.props.onAppChange(ev.target.value);
    }

    onFileChange(ev) {
        /** @type {HTMLInputElement} */
        let fileInput = ev.target;
        let imageFile = fileInput.files.item(0);

        if (imageFile.size > CHATSHIER_CFG.FILE.MEGA_BYTE) {
            return notify('圖片大小不能超過 1 MB', { type: 'warning' });
        }
        return blobToBase64(imageFile).then((base64Url) => {
            this.setState({ photo: base64Url });
        });
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

                        <FormGroup className="d-flex">
                            <Button type="button" color="light" className="position-relative p-0 photo-container"
                                onClick={() => this.fileInput && this.fileInput.click()}>
                                {!this.state.photo &&
                                <div className="d-flex w-100 h-100 image-upload">
                                    <div className="m-auto text-muted">
                                        <i className="fas fa-image"></i>
                                        <br />
                                        <span>上傳頭像</span>
                                        <br />
                                        <span className="text-danger small">檔案不能超過 1 MB</span>
                                    </div>
                                </div>}
                                <div className="m-auto image-container" style={{ width: '8rem', height: '8rem' }}>
                                    <img className="image-fit" src={this.state.photo || defaultAvatarPng} alt={this.state.name} />
                                </div>
                            </Button>
                            <input className="d-none" type="file"
                                accept="image/png,image/jpg,image/jpeg"
                                ref={(elem) => (this.fileInput = elem)}
                                onChange={this.onFileChange} />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {!this.props.isUpdate && <span className="mr-1 text-danger">*</span>}
                                Gmail:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder={this.props.t('Fill the receptionist\'s Gmail')}
                                value={this.state.email}
                                pattern={regex.emailWeak.source}
                                maxLength={50}
                                onChange={(ev) => this.setState({ email: ev.target.value })}
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
                                disabled={this.state.isAsyncProcessing}>
                                <Trans i18nKey="Add" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="submit" color="primary"
                                disabled={this.state.isAsyncProcessing}>
                                <Trans i18nKey="Update" />
                            </Button>}

                            {this.props.isUpdate &&
                            <Button className="mr-1" type="button" color="danger"
                                onClick={() => this.props.deleteHandler && this.props.deleteHandler(this.props.receptionistId)}
                                disabled={this.state.isAsyncProcessing}>
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
