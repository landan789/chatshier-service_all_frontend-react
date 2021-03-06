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

import defaultProductImg from '../../../image/default-product.png';
// import defaultCategoryImg from '../../../image/default-category.png';

import './Category.css';

class CategoryModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsCategories: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        categoryId: PropTypes.string,
        category: PropTypes.object.isRequired,
        insertHandler: PropTypes.func.isRequired,
        updateHandler: PropTypes.func.isRequired,
        removeHandler: PropTypes.func.isRequired,
        onAppChange: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Models.Category} */
        let category = props.category || {};

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            name: category.name || '',
            description: category.description || '',
            productIds: category.product_ids || []
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let category = {
            parent_id: this.props.category.parent_id || '',
            name: this.state.name,
            description: this.state.description,
            product_ids: this.state.productIds
        };
        return this.props.isUpdate ? this.props.updateHandler(this.props.categoryId, category) : this.props.insertHandler(category);
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

    onAppChange(ev) {
        this.setState({ appId: ev.target.value });
        return this.props.onAppChange(ev.target.value);
    }

    render() {
        if (!this.props.category) {
            return null;
        }

        let appProducts = this.props.appsProducts[this.state.appId] || { products: {} };

        /** @type {Chatshier.Models.Products} */
        let products = appProducts.products;
        let productIds = Object.keys(products).filter((productId) => apiDatabase.appsProducts.TYPES.APPOINTMENT === products[productId].type);
        let categoryProductIds = this.state.productIds;

        return (
            <Modal className="category-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit category' : 'Add category'} />
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

                        {/* <FormGroup className="d-flex flex-wrap">
                            <label className="w-100 col-form-label font-weight-bold">
                                類別圖像:
                            </label>
                            <Button type="button" color="light" className="position-relative p-0 photo-container"
                                onClick={() => this.fileInput && this.fileInput.click()}>
                                {!this.state.src &&
                                <div className="d-flex w-100 h-100 image-upload">
                                    <div className="m-auto text-muted">
                                        <i className="fas fa-image"></i>
                                        <br />
                                        <span>上傳類別圖像</span>
                                        <br />
                                        <span className="text-danger small">檔案不能超過 1 MB</span>
                                    </div>
                                </div>}
                                <div className="m-auto image-container">
                                    <img className="image-fit" style={{ opacity: !this.state.src ? '.3' : '1' }}
                                        src={this.state.src || defaultCategoryImg} alt={this.state.name} />
                                </div>
                            </Button>
                            <input className="d-none" type="file"
                                accept="image/png,image/jpg,image/jpeg"
                                ref={(elem) => (this.fileInput = elem)}
                                onChange={this.onFileChange} />
                        </FormGroup> */}

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                {!this.props.isUpdate && <span className="mr-1 text-danger">*</span>}
                                類別名稱:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder="請輸入類別名稱"
                                value={this.state.name}
                                maxLength={50}
                                onChange={(ev) => this.setState({ name: ev.target.value })}
                                required />
                        </FormGroup>

                        {/* <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Description" />:
                            </label>
                            <textarea className="form-control"
                                type="text"
                                placeholder="請輸入類別描述"
                                value={this.state.description}
                                maxLength={200}
                                rows={6}
                                style={{ resize: 'none' }}
                                onChange={(ev) => this.setState({ description: ev.target.value })}>
                            </textarea>
                        </FormGroup> */}

                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <span>選取產品</span>:
                            </label>
                            <Card className="flex-row flex-wrap p-2">
                                {0 === productIds.length &&
                                <div className="m-auto">
                                    <span className="py-3 text-muted small">沒有可選擇的產品</span>
                                </div>}

                                {productIds.map((productId) => {
                                    let product = products[productId];
                                    let isSelected = categoryProductIds.indexOf(productId) >= 0;
                                    let className = 'm-1 p-2 product-item cursor-pointer';

                                    return (
                                        <div key={productId} className={className}
                                            onClick={() => {
                                                let _productIds = this.state.productIds.slice();
                                                let idx = _productIds.indexOf(productId);
                                                if (idx >= 0) {
                                                    _productIds.splice(idx, 1);
                                                } else {
                                                    _productIds.push(productId);
                                                }
                                                this.setState({ productIds: _productIds });
                                            }}>
                                            <div className="image-container">
                                                <img className="image-fit border-circle" src={product.src || defaultProductImg} alt={product.name} />
                                            </div>
                                            <div className="product-name text-center text-muted small">
                                                <span>{product.name}</span>
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
                                onClick={() => this.props.removeHandler && this.props.removeHandler(this.props.categoryId)}
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
        appsCategories: storeState.appsCategories,
        appsProducts: storeState.appsProducts
    });
};

export default withTranslate(connect(mapStateToProps)(CategoryModal));
