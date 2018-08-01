import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';

import ModalCore from '../ModalCore';

class ReceptionistModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        receptionistId: PropTypes.string,
        receptionist: PropTypes.object,
        insertHandler: PropTypes.func,
        updateHandler: PropTypes.func,
        deleteHandler: PropTypes.func,
        onAppChange: PropTypes.func
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            receptionist: props.receptionist || {}
        };
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
                    <FormGroup>
                        <label className="form-check-label col-form-label font-weight-bold">
                            {!this.props.isUpdate &&
                            <span className="mr-1 text-danger">*</span>}
                            <Trans i18nKey="Name" />:
                        </label>
                        <input className="form-control"
                            type="text"
                            placeholder={this.props.t('Fill the receptionist\'s name')}
                            value={this.state.title}
                            onChange={(ev) => {
                                let receptionist = this.state.receptionist;
                                receptionist.name = ev.target.value;
                                this.setState({ receptionist: receptionist });
                            }} />
                    </FormGroup>

                    <FormGroup>
                        <label className="form-check-label col-form-label font-weight-bold">
                            {!this.props.isUpdate &&
                            <span className="mr-1 text-danger">*</span>}
                            Gmail:
                        </label>
                        <input className="form-control"
                            type="text"
                            placeholder={this.props.t('Fill the receptionist\'s gmail')}
                            value={this.state.title}
                            onChange={(ev) => {
                                let receptionist = this.state.receptionist;
                                receptionist.gmail = ev.target.value;
                                this.setState({ receptionist: receptionist });
                            }} />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    {!this.props.isUpdate &&
                    <Button color="primary"
                        onClick={() => this.props.insertHandler && this.props.insertHandler(this.state.receptionist)}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Add" />
                    </Button>}

                    {this.props.isUpdate &&
                    <Button color="primary"
                        onClick={() => this.props.updateHandler && this.props.updateHandler(this.props.receptionistId, this.state.receptionist)}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Update" />
                    </Button>}

                    {this.props.isUpdate &&
                    <Button color="danger"
                        onClick={() => this.props.deleteHandler && this.props.deleteHandler(this.props.receptionistId)}
                        disabled={this.state.isAsyncWorking}>
                        <Trans i18nKey="Remove" />
                    </Button>}

                    <Button color="secondary" onClick={this.closeModal}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
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
