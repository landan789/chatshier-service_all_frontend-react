import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap';

import ModalCore from '../ModalCore';
import apiDatabase from '../../../helpers/apiDatabase';

class ProductModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        isUpdate: PropTypes.bool.isRequired,
        appId: PropTypes.string,
        productId: PropTypes.string,
        product: PropTypes.object,
        insertHandler: PropTypes.func.isRequired,
        updateHandler: PropTypes.func.isRequired,
        deleteHandler: PropTypes.func.isRequired,
        onAppChange: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.Models.Product} */
        let product = props.product || {};

        this.state = {
            isOpen: props.isOpen,
            appId: props.appId || '',
            name: product.name,
            description: product.description
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
    }

    onSubmitForm(ev) {
        ev.preventDefault();

        let product = {
            name: this.state.name,
            description: this.state.description
        };
        return this.props.isUpdate ? this.props.updateHandler(this.props.productId, product) : this.props.insertHandler(product);
    }

    onAppChange(ev) {
        this.setState({ appId: ev.target.value });
        return this.props.onAppChange(ev.target.value);
    }

    render() {
        if (!this.props.product) {
            return null;
        }

        return (
            <Modal className="product-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    <Trans i18nKey={this.props.isUpdate ? 'Edit product' : 'Add product'} />
                </ModalHeader>

                <ModalBody>
                    <form onSubmit={this.onSubmitForm}>
                        {!this.props.isUpdate &&
                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold">
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
                            <label className="form-check-label col-form-label font-weight-bold">
                                {!this.props.isUpdate && <span className="mr-1 text-danger">*</span>}
                                <Trans i18nKey="Name" />:
                            </label>
                            <input className="form-control"
                                type="text"
                                placeholder={this.props.t('Fill the product name')}
                                value={this.state.name}
                                maxLength={50}
                                onChange={(ev) => this.setState({ name: ev.target.value })}
                                required />
                        </FormGroup>

                        <FormGroup>
                            <label className="form-check-label col-form-label font-weight-bold">
                                <Trans i18nKey="Description" />:
                            </label>
                            <textarea className="form-control"
                                type="text"
                                placeholder={this.props.t('Fill the product description')}
                                value={this.state.description}
                                maxLength={50}
                                onChange={(ev) => this.setState({ description: ev.target.value })}>
                            </textarea>
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
                                onClick={() => this.props.deleteHandler && this.props.deleteHandler(this.props.productId)}
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
        appsProducts: storeState.appsProducts
    });
};

export default withTranslate(connect(mapStateToProps)(ProductModal));
