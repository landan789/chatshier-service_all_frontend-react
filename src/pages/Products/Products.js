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

import './Products.css';

class Products extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsProducts: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: ''
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertProduct = this.insertProduct.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsProducts.find()
        ]);
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    insertProduct() {
        let product = {
            name: '測試產品',
            description: '產品描述_' + Date.now(),
            canAppoint: true
        };

        let appId = this.state.appId;
        return apiDatabase.appsProducts.insert(appId, product);
    }

    updateProduct(productId) {
        let product = {
            name: '測試類別_更新',
            description: '類別描述_' + Date.now(),
            canAppoint: true,
            receptionist_ids: ['5b5c44caf0eeb21fe418c558', '5b5c44e4f0eeb21fe418c55e']
        };

        let appId = this.state.appId;
        return apiDatabase.appsProducts.update(appId, productId, product);
    }

    deleteProduct(productId) {
        let appId = this.state.appId;
        return apiDatabase.appsProducts.delete(appId, productId);
    }

    render() {
        let appId = this.state.appId;
        let appProducts = this.props.appsProducts[appId] || { products: {} };
        /** @type {Chatshier.Models.Products} */
        let products = appProducts.products;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Product management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">產品管理</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 產品管理</p>
                                <p className="mb-3 pt-0 px-3">新增、更新或刪除產品</p>
                            </div>
                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <Button color="info" onClick={this.insertProduct}>新增產品</Button>
                            <div className="products-wrapper">
                                {Object.keys(products).map((productId) => {
                                    let product = products[productId];
                                    return (
                                        <Aux key={productId}>
                                            <div>產品ID: {productId}</div>
                                            <div>產品名稱: {product.name}</div>
                                            <div>產品描述: {product.description}</div>
                                            <div>服務人員數: {product.receptionist_ids.length}</div>
                                            <Button color="primary" onClick={() => this.updateProduct(productId)}>更新產品</Button>
                                            <Button color="danger" onClick={() => this.deleteProduct(productId)}>刪除產品</Button>
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
        appsProducts: storeState.appsProducts
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Products)));
