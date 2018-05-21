import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';

import apiDatabase from '../../../helpers/apiDatabase/index';
import authHelper from '../../../helpers/authentication';

import { notify } from '../../Notify/Notify';

const APP_TYPES = Object.freeze({
    LINE: 'LINE',
    FACEBOOK: 'FACEBOOK',
    WECHAT: 'WECHAT'
});

class AppEditModal extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        close: PropTypes.func.isRequired,
        modalData: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        let app = this.props.modalData.app;
        this.state = {
            isOpen: this.props.isOpen,
            isProcessing: false,
            appName: app.name || '',
            appId1: app.id1 || '',
            appId2: app.id2 || '',
            appSecret: app.secret || '',
            appToken1: app.token1 || '',
            appToken2: app.token2 || ''
        };

        this.updateApp = this.updateApp.bind(this);
    }

    updateApp() {
        let appId = this.props.modalData.appId;
        let appType = this.props.modalData.app.type;

        let putApp = {
            name: this.state.appName,
            id1: this.state.appId1,
            secret: this.state.appSecret
        };

        switch (appType) {
            case APP_TYPES.LINE:
                putApp.token1 = this.state.appToken1;
                break;
            case APP_TYPES.FACEBOOK:
            case APP_TYPES.WECHAT:
            default:
                break;
        }

        let userId = authHelper.userId;
        this.setState({ isProcessing: true });
        return apiDatabase.apps.update(appId, userId, putApp).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).then(() => {
            this.props.close();
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify(this.props.t('Failed to update!'), { type: 'danger' });
        });
    }

    render() {
        let appType = this.props.modalData.app.type;

        return (
            <Modal className="app-edit-modal" isOpen={this.state.isOpen} toggle={this.props.close}>
                <ModalHeader toggle={this.props.close}>
                    <Trans i18nKey="Edit bot" />
                </ModalHeader>
                <ModalBody>
                    <form className="app-form">
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {APP_TYPES.LINE === appType && <span><Trans i18nKey="Bot name" />:</span>}
                                {APP_TYPES.FACEBOOK === appType && <span><Trans i18nKey="Fan page name" />:</span>}
                            </label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    value={this.state.appName}
                                    onChange={(ev) => this.setState({ appName: ev.target.value })}
                                    readOnly={APP_TYPES.FACEBOOK === appType} />
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {APP_TYPES.LINE === appType && <span>Channel ID:</span>}
                                {APP_TYPES.FACEBOOK === appType && <span><Trans i18nKey="Fan page ID" />:</span>}
                            </label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    value={this.state.appId1}
                                    onChange={(ev) => this.setState({ appId1: ev.target.value })}
                                    readOnly={APP_TYPES.FACEBOOK === appType} />
                            </div>
                        </FormGroup>

                        {APP_TYPES.FACEBOOK !== appType &&
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Channel secret:</label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    value={this.state.appSecret}
                                    onChange={(ev) => this.setState({ appSecret: ev.target.value })} />
                            </div>
                        </FormGroup>}

                        {APP_TYPES.FACEBOOK !== appType &&
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Channel access token:</label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    value={this.state.appToken1}
                                    onChange={(ev) => this.setState({ appToken1: ev.target.value })} />
                            </div>
                        </FormGroup>}
                    </form>
                </ModalBody>

                <ModalFooter>
                    {APP_TYPES.FACEBOOK !== appType &&
                    <Button color="primary" onClick={this.updateApp} disabled={this.state.isProcessing}>
                        <Trans i18nKey="Update" />
                    </Button>}

                    <Button color="secondary" onClick={this.props.close}>
                        <Trans i18nKey="Cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslate(AppEditModal);
