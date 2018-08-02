import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card, CardBody, CardFooter, UncontrolledTooltip } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ProductModal from '../../components/Modals/Product/Product';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import { notify } from '../../components/Notify/Notify';

import logoPng from '../../image/logo.png';

import './Products.css';

class Products extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        appsReceptionists: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: '',
            isAsyncProcessing: false
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertProduct = this.insertProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.closeModal = this.closeModal.bind(this);

        browserHelper.setTitle(this.props.t('Product management'));
        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsReceptionists.find(),
            apiDatabase.appsProducts.find()
        ]);
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    insertProduct(product) {
        let postProduct = Object.assign({
            canAppoint: true
        }, product);

        let appId = this.state.appId;
        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsProducts.insert(appId, postProduct).then(() => {
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    updateProduct(productId, product) {
        let appId = this.state.appId;
        /** @type {Chatshier.Models.Product} */
        let _product = this.props.appsProducts[appId].products[productId];

        let appReceptionists = this.props.appsReceptionists[appId] || { receptionists: {} };
        let receptionists = appReceptionists.receptionists;
        _product.receptionist_ids = (_product.receptionist_ids || []).filter((receptionistId) => !!receptionists[receptionistId]);

        let putProduct = Object.assign({}, _product, product);

        return apiDatabase.appsProducts.update(appId, productId, putProduct).then(() => {
            this.closeModal();
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    deleteProduct(productId) {
        let appId = this.state.appId;
        return apiDatabase.appsProducts.delete(appId, productId).then(() => {
            this.closeModal();
            return notify(this.props.t('Remove successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            productId: void 0,
            product: void 0
        });
    }

    render() {
        let appId = this.state.appId;
        let appProducts = this.props.appsProducts[appId] || { products: {} };

        /** @type {Chatshier.Models.Products} */
        let products = appProducts.products;
        let productIds = Object.keys(products).filter((productId) => {
            let _product = products[productId];
            return _product && _product.canAppoint;
        }).sort((a, b) => {
            let tA = new Date(products[a].updatedTime);
            let tB = new Date(products[b].updatedTime);

            if (tA < tB) {
                return 1;
            } else if (tA > tB) {
                return -1;
            } else {
                return 0;
            }
        });
        let appReceptionists = this.props.appsReceptionists[appId] || { receptionists: {} };
        let receptionists = appReceptionists.receptionists;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Product management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3"><Trans i18nKey="Product management" /></h3>
                                <p className="mb-3 pt-0 px-3"><Trans i18nKey="Home" /> / <Trans i18nKey="Appointment system" /> / <Trans i18nKey="Product management" /></p>
                                <p className="mb-3 pt-0 px-3">新增、更新或刪除產品</p>
                            </div>

                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <div className="px-3 pt-0 d-flex flex-wrap products-wrapper">
                                <Card className="w-100 m-2 add-btn" onClick={() => this.setState({ product: {} })}>
                                    <i className="m-auto fas fa-plus fa-2x"></i>
                                </Card>

                                {productIds.map((productId) => {
                                    let product = products[productId];
                                    let receptionistIds = (product.receptionist_ids || []).filter((receptionistId) => !!receptionists[receptionistId]);
                                    let description = (product.description || '無描述');
                                    description = description.length > 30 ? description.substring(0, 30) + '...' : description;

                                    return (
                                        <Card key={productId} className="d-inline-block w-100 m-2 product-item">
                                            <CardBody className="p-2 text-center bg-transparent">
                                                <div className="mx-auto image-container border-circle">
                                                    <img className="image-fit border-circle" src={product.src || logoPng} alt={product.name} />
                                                </div>
                                                <div className="mt-2 px-3 font-weight-bold text-info">{product.name}</div>
                                                <div className="mt-1 px-3 text-muted small">{description}</div>
                                            </CardBody>

                                            <CardFooter className="pb-4 card-footer flex-column d-inherit border-none bg-transparent">
                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-users fa-fw fa-1p5x"></i>
                                                    <span className="small">服務人員數 {receptionistIds.length} 人</span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-shopping-cart fa-fw fa-1p5x"></i>
                                                    <span className="small">
                                                        上架狀態 {product.isOnShelves ? <span className="text-success">已上架</span> : <span className="text-danger">未上架</span>}
                                                    </span>
                                                </div>

                                                <div className="mt-2 d-flex justify-content-around">
                                                    <Button color="light" id={'productEditBtn_' + productId}
                                                        onClick={() => {
                                                            this.setState({
                                                                productId: productId,
                                                                product: products[productId]
                                                            });
                                                        }}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'productEditBtn_' + productId}>編輯</UncontrolledTooltip>

                                                    <Button color="light" id={'productDeleteBtn_' + productId}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'productDeleteBtn_' + productId}>刪除</UncontrolledTooltip>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.product &&
                <ProductModal isOpen={!!this.state.product}
                    isUpdate={!!this.state.productId}
                    appId={this.state.appId}
                    productId={this.state.productId}
                    product={this.state.product}
                    insertHandler={this.insertProduct}
                    updateHandler={this.updateProduct}
                    deleteHandler={this.deleteProduct}
                    onAppChange={this.appChanged}
                    close={this.closeModal} />}
            </Aux>
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

export default withRouter(withTranslate(connect(mapStateToProps)(Products)));
