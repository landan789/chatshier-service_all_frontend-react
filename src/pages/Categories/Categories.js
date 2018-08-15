import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card, UncontrolledTooltip } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';
import SortableTree from 'react-sortable-tree';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import confirmDialog from '../../components/Modals/Confirm/Confirm';
import CategoryModal from '../../components/Modals/Category/Category';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import { notify } from '../../components/Notify/Notify';

import defaultProductImg from '../../image/default-product.png';

import './Categories.css';

const MAX_DEPTH = 2;

class Categories extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsCategories: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        let appId = nextState.appId;
        if (!(appId && nextProps.appsCategories[appId])) {
            return nextState;
        }

        let appCategories = nextProps.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

        nextState.treeData && (nextState.treeData.length = 0);
        nextState.treeData = Categories.createTreeData(categories);
        return nextState;
    }

    /**
     * @param {Chatshier.Models.Categories} categories
     */
    static createTreeData(categories) {
        let treeData = [{
            categoryId: '',
            expanded: false
        }];
        let treeNodes = {};
        let categoryIds = Object.keys(categories);

        while (categoryIds.length > 0) {
            let categoryId = categoryIds.shift();
            let category = categories[categoryId];
            if (apiDatabase.appsCategories.TYPES.APPOINTMENT !== category.type) {
                continue;
            }

            let node = {
                categoryId: categoryId,
                title: category.name || '',
                expanded: true,
                children: []
            };
            node.title = node.title.length > 10 ? node.title.substring(0, 10) + '...' : node.title;

            if (!category.parent_id) {
                // 沒有父類別，代表為根節點
                treeData.push(node);
                treeNodes[categoryId] = node;
            } else if (treeNodes[category.parent_id]) {
                // 有父類別，且父類別已新增節點
                treeNodes[category.parent_id].children.push(node);
                treeNodes[categoryId] = node;
            } else if (categories[category.parent_id]) {
                // 有父類別，但父類別尚未新增節點，則移至最後處理
                categoryIds.push(categoryId);
            }
        }

        return treeData;
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHlp.setTitle(props.t('Appointment categoies'));
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.state = Object.assign({
            prevProps: null,
            appId: '',
            selectedCategoryId: '',
            treeData: []
        }, Categories.getDerivedStateFromProps(props, {}));

        this.appChanged = this.appChanged.bind(this);
        this.insertCategory = this.insertCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);

        this.generateNodeProps = this.generateNodeProps.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsCategories.find(),
            apiDatabase.appsProducts.find()
        ]);
    }

    appChanged(appId) {
        let appCategories = this.props.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

        let nextState = this.state;
        nextState.treeData && (nextState.treeData.length = 0);
        nextState.treeData = Categories.createTreeData(categories);
        this.setState({ appId: appId, selectedCategoryId: '' });
    }

    insertCategory(category) {
        let postCategory = Object.assign({
            type: apiDatabase.appsCategories.TYPES.APPOINTMENT,
            parent_id: ''
        }, category);

        let appId = this.state.appId;
        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsCategories.insert(appId, postCategory).then(() => {
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    updateCategory(categoryId, category) {
        let appId = this.state.appId;
        /** @type {Chatshier.Models.Category} */
        let _category = this.props.appsCategories[appId].categories[categoryId];

        let appProducts = this.props.appsProducts[appId] || { products: {} };
        let products = appProducts.products;
        _category.product_ids = (_category.product_ids || []).filter((productId) => !!products[productId]);

        let putCategory = Object.assign({}, _category, category);

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsCategories.update(appId, categoryId, putCategory).then(() => {
            this.closeModal();
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    removeCategory(categoryId) {
        return confirmDialog({
            title: '刪除確認',
            message: '確定要刪除這個目錄嗎？',
            confirmText: this.props.t('Confirm'),
            confirmColor: 'danger',
            cancelText: this.props.t('Cancel')
        }).then((isConfirm) => {
            if (!isConfirm) {
                return;
            }

            let appId = this.state.appId;
            this.setState({ isAsyncProcessing: true });
            return apiDatabase.appsCategories.delete(appId, categoryId).then(() => {
                this.closeModal();
                return notify(this.props.t('Remove successful!'), { type: 'success' });
            }).catch(() => {
                this.setState({ isAsyncProcessing: false });
                return notify(this.props.t('An error occurred!'), { type: 'danger' });
            });
        });
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            categoryId: void 0,
            category: void 0
        });
    }

    generateNodeProps(categoryNode) {
        let appId = this.state.appId;
        let appCategories = this.props.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

        let categoryId = categoryNode.node.categoryId;
        let insertId = 'categoryInsert_' + categoryId;
        let updateId = 'categoryUpdate_' + categoryId;
        let removeId = 'categoryDelete_' + categoryId;

        let nodeProps = {
            className: 'cursor-pointer category-node' + (categoryId && this.state.selectedCategoryId === categoryId ? ' selected' : ''),
            onClick: () => {
                if (!categoryId || this.state.selectedCategoryId === categoryId) {
                    return;
                }
                this.setState({ selectedCategoryId: categoryId });
            },
            buttons: []
        };

        if (categoryNode.path.length < MAX_DEPTH) {
            nodeProps.buttons.push(
                <Button color="light" size="sm" className={!categoryId ? ' absolute-stretch' : ''}
                    key={insertId}
                    id={insertId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.setState({ category: { parent_id: categoryId } })}>
                    <i className="fas fa-plus"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={insertId + '_tooltip'}
                    target={insertId}>
                    <span>{categoryId ? '新增子類別' : '新增'}</span>
                </UncontrolledTooltip>
            );
        }

        if (categoryId && categories[categoryId]) {
            nodeProps.buttons.push(
                <Button color="light" size="sm"
                    key={updateId}
                    id={updateId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.setState({ categoryId: categoryId, category: categories[categoryId] })}>
                    <i className="fas fa-edit"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={updateId + '_tooltip'}
                    target={updateId}>
                    <span>編輯</span>
                </UncontrolledTooltip>,
                <Button color="light" size="sm"
                    key={removeId}
                    id={removeId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.removeCategory(categoryId)}>
                    <i className="fas fa-trash-alt"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={removeId + '_tooltip'}
                    target={removeId}>
                    <span>刪除</span>
                </UncontrolledTooltip>
            );

            let productCount = this._findProductIds(appId, categoryId).length;
            nodeProps.buttons.unshift(
                <div className="d-flex justify-content-center align-items-center text-center w-100 h-100 mr-2"
                    key={'productIds_' + categoryId}>
                    <span className="p-1 text-light bg-warning border-circle small count-badge">
                        {productCount > 99 ? '99' : productCount}
                    </span>
                </div>
            );
        }
        return nodeProps;
    }

    render() {
        if (!this.state) {
            return null;
        }

        let appId = this.state.appId;
        let categoryProductIds = this._findProductIds(appId, this.state.selectedCategoryId);

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
                                <h3 className="mb-4 pt-3 px-3"><Trans i18nKey="Appointment categoies" /></h3>
                                <p className="mb-3 pt-0 px-3"><Trans i18nKey="Home" /> / <Trans i18nKey="Appointment system" /> / <Trans i18nKey="Appointment categoies" /></p>
                                <p className="mb-3 pt-0 px-3 text-muted small">管理預約目錄</p>
                            </div>

                            <AppsSelector className="px-3 mt-3" onChange={this.appChanged} />

                            <div className="d-flex flex-wrap px-3 justify-content-between categories-wrapper">
                                <Card className="mt-3 px-0 col-12 col-lg-5">
                                    <SortableTree treeData={this.state.treeData}
                                        getNodeKey={(categoryNode) => categoryNode.node.categoryId}
                                        canDrag={false}
                                        maxDepth={MAX_DEPTH}
                                        onChange={(treeData) => this.setState({ treeData: treeData })}
                                        generateNodeProps={this.generateNodeProps} />
                                </Card>

                                <Card className="mt-3 p-2 col-12 col-lg-6">
                                    <div className="h-100 scoll-wrapper">
                                        {(!this.state.selectedCategoryId || 0 === categoryProductIds.length) &&
                                        <div className="d-flex absolute-stretch">
                                            <div className="m-auto text-center text-muted">
                                                <i className="mb-2 fas fa-meh fa-6x"></i>
                                                <br />
                                                <span>無任何產品</span>
                                            </div>
                                        </div>}

                                        {categoryProductIds.map((productId) => {
                                            let product = products[productId];
                                            if (!product) {
                                                return null;
                                            }

                                            let className = 'm-1 p-2 d-inline-block product-item';
                                            return (
                                                <div key={productId} className={className}>
                                                    <div className="image-container">
                                                        <img className="image-fit" src={product.src || defaultProductImg} alt={product.name} />
                                                    </div>
                                                    <div className="mt-1 text-ellipsis text-center text-muted small">
                                                        <span>{product.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.category &&
                <CategoryModal isOpen={!!this.state.category}
                    isUpdate={!!this.state.categoryId}
                    appId={this.state.appId}
                    categoryId={this.state.categoryId}
                    category={this.state.category}
                    insertHandler={this.insertCategory}
                    updateHandler={this.updateCategory}
                    removeHandler={this.removeCategory}
                    onAppChange={this.appChanged}
                    close={this.closeModal} />}
            </Aux>
        );
    }

    /**
     * @param {string} appId
     * @param {string} categoryId
     * @returns {string[]}
     */
    _findProductIds(appId, categoryId) {
        let appCategories = this.props.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

        let productIdsMap = {};
        if (!(categoryId && categories[categoryId])) {
            return Object.keys(productIdsMap);
        }

        let category = categories[categoryId];
        let productIds = category.product_ids || [];
        for (let i in productIds) { productIdsMap[productIds[i]] = productIds[i]; }
        productIds = void 0;

        let idFilter = (ids, id) => ids.filter((_id) => _id !== id);
        let searchId = categoryId;
        let categoryIds = idFilter(Object.keys(categories), searchId);
        while (categoryIds.length > 0) {
            let _categoryId = categoryIds.shift();
            let _category = categories[_categoryId];
            if (_category.parent_id && _category.parent_id === searchId) {
                let _productIds = _category.product_ids || [];
                for (let i in _productIds) { productIdsMap[_productIds[i]] = _productIds[i]; }
                productIds = void 0;

                searchId = _categoryId;
                categoryIds.length = 0;
                categoryIds = idFilter(Object.keys(categories), searchId);
            }
        }
        searchId = categoryIds = void 0;
        return Object.keys(productIdsMap);
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

export default withRouter(withTranslate(connect(mapStateToProps)(Categories)));
