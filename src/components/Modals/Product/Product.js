import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody,
    FormGroup, Card } from 'reactstrap';

import ModalCore from '../ModalCore';
import CHATSHIER_CFG from '../../../config/chatshier';
import apiDatabase from '../../../helpers/apiDatabase';
import { blobToBase64 } from '../../../utils/common';
import { notify } from '../../Notify/Notify';

import defaultConsumerImg from '../../../image/default-consumer.png';
import defaultProductImg from '../../../image/default-product.png';

import './Product.css';

class ProductModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        productId: PropTypes.string,
        product: PropTypes.object.isRequired,
        insertHandler: PropTypes.func.isRequired,
        updateHandler: PropTypes.func.isRequired,
        removeHandler: PropTypes.func.isRequired,
        onAppChange: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Models.Product} */
        let product = props.product || {};

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            name: product.name || '',
            src: product.src || '',
            description: product.description || '',
            isOnShelf: !!product.isOnShelf,
            receptionistIds: product.receptionist_ids || []
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let product = {
            name: this.state.name,
            description: this.state.description,
            isOnShelf: this.state.isOnShelf,
            receptionist_ids: this.state.receptionistIds,
            src: (this.fileInput && this.fileInput.files.item(0)) || this.state.src
        };

        this.setState({ isAsyncProcessing: true });
        return Promise.resolve().then(() => {
            if (this.props.isUpdate) {
                return this.props.updateHandler(this.props.productId, product);
            }
            return this.props.insertHandler(product);
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
            this.setState({ src: base64Url });
        });
    }

    render() {
        if (!this.props.product) {
            return null;
        }

        let appReceptionists = this.props.appsReceptionists[this.state.appId] || { receptionists: {} };

        /** @type {Chatshier.Models.Receptionists} */
        let receptionists = appReceptionists.receptionists;
        let receptionistIds = Object.keys(receptionists);
        let productReceptionistIds = this.state.receptionistIds;

        return (
            <Modal className="product-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit product' : 'Add product'} />
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

                        <FormGroup className="d-flex flex-wrap">
                            <label className="w-100 col-form-label font-weight-bold">
                                產品圖像:
                            </label>
                            <Button type="button" color="light" className="position-relative p-0 photo-container"
                                onClick={() => this.fileInput && this.fileInput.click()}>
                                {!this.state.src &&
                                <div className="d-flex w-100 h-100 image-upload">
                                    <div className="m-auto text-muted">
                                        <i className="fas fa-image"></i>
                                        <br />
                                        <span>上傳商品圖像</span>
                                        <br />
                                        <span className="text-danger small">檔案不能超過 1 MB</span>
                                    </div>
                                </div>}
                                <div className="m-auto image-container" style={{ width: '8rem', height: '8rem' }}>
                                    <img className="image-fit" style={{ opacity: !this.state.src ? '.3' : '1' }}
                                        src={this.state.src || defaultProductImg} alt={this.state.name} />
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
                                產品名稱:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder="請輸入產品名稱"
                                value={this.state.name}
                                maxLength={50}
                                onChange={(ev) => this.setState({ name: ev.target.value })}
                                required />
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Description" />:
                            </label>
                            <textarea className="form-control"
                                type="text"
                                placeholder="請輸入產品描述"
                                value={this.state.description}
                                maxLength={200}
                                rows={6}
                                style={{ resize: 'none' }}
                                onChange={(ev) => this.setState({ description: ev.target.value })}>
                            </textarea>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <span>上架狀態</span>:
                            </label>
                            <FormGroup check>
                                <label className="form-check-label col-form-label">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.isOnShelf}
                                        onChange={(ev) => this.setState({ isOnShelf: ev.target.checked })} />
                                    <span>已上架</span>
                                </label>
                            </FormGroup>
                        </FormGroup>

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <span>服務人員</span>:
                            </label>
                            <Card className="flex-row flex-wrap p-2">
                                {0 === receptionistIds.length &&
                                <div className="m-auto">
                                    <span className="py-3 text-muted small">沒有可選擇的服務人員</span>
                                </div>}

                                {receptionistIds.map((receptionistId) => {
                                    let receptionist = receptionists[receptionistId];
                                    let isSelected = productReceptionistIds.indexOf(receptionistId) >= 0;
                                    let className = 'm-1 p-2 receptionist-item cursor-pointer';

                                    return (
                                        <div key={receptionistId} className={className}
                                            onClick={() => {
                                                let _receptionistIds = this.state.receptionistIds.slice();
                                                let idx = _receptionistIds.indexOf(receptionistId);
                                                if (idx >= 0) {
                                                    _receptionistIds.splice(idx, 1);
                                                } else {
                                                    _receptionistIds.push(receptionistId);
                                                }
                                                this.setState({ receptionistIds: _receptionistIds });
                                            }}>
                                            <div className="image-container">
                                                <img className="image-fit border-circle" src={receptionist.photo || defaultConsumerImg} alt={receptionist.name} />
                                            </div>
                                            <div className="text-ellipsis text-center text-muted small">
                                                <span>{receptionist.name}</span>
                                            </div>

                                            {isSelected &&
                                            <div className="selected-effect position-absolute d-flex w-100 h-100 animated fadeIn">
                                                <i className="m-auto fas fa-check-circle fa-2x text-success"></i>
                                            </div>}
                                        </div>
                                    );
                                })}
                            </Card>
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
                                onClick={() => this.props.removeHandler && this.props.removeHandler(this.props.productId)}
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
        appsReceptionists: storeState.appsReceptionists,
        appsProducts: storeState.appsProducts
    });
};

export default withTranslate(connect(mapStateToProps)(ProductModal));
