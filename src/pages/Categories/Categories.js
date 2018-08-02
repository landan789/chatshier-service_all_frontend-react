import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card, UncontrolledTooltip } from 'reactstrap';
import { withTranslate } from '../../i18n';
import SortableTree from 'react-sortable-tree';

import apiDatabase from '../../helpers/apiDatabase/index';

import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import { notify } from '../../components/Notify/Notify';

import './Categories.css';

class Categories extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsCategories: PropTypes.object.isRequired,
        appsProducts: PropTypes.object.isRequired
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
            let node = {
                categoryId: categoryId,
                title: category.name || '',
                subtitle: category.description || '',
                expanded: true,
                children: []
            };
            node.title = node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title;
            node.subtitle = node.subtitle.length > 30 ? node.subtitle.substring(0, 30) + '...' : node.subtitle;

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

        this.state = Object.assign({
            prevProps: null,
            appId: '',
            treeData: []
        }, Categories.getDerivedStateFromProps(props, {}));

        this.appChanged = this.appChanged.bind(this);
        this.insertCategory = this.insertCategory.bind(this);

        this.generateNodeProps = this.generateNodeProps.bind(this);
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
        this.setState({ appId: appId });
    }

    insertCategory(category) {
        let postCategory = Object.assign({
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

    deleteCategory(categoryId) {
        let appId = this.state.appId;
        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsCategories.delete(appId, categoryId).then(() => {
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
        let deleteId = 'categoryDelete_' + categoryId;

        let nodeProps = {
            className: 'category-node',
            buttons: [
                <Button color="light" size="sm" className={!categoryId ? ' absolute-stretch' : ''}
                    key={insertId}
                    id={insertId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.setState({ category: categories[categoryId] })}>
                    <i className="fas fa-plus"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={insertId + '_tooltip'}
                    target={insertId}>
                    <span>{categoryId ? '新增子類別' : '新增'}</span>
                </UncontrolledTooltip>
            ]
        };

        if (categoryId) {
            nodeProps.buttons.push(
                <Button color="light" size="sm"
                    key={updateId}
                    id={updateId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.setState({ category: { parent_id: categoryId } })}>
                    <i className="fas fa-edit"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={updateId + '_tooltip'}
                    target={updateId}>
                    <span>編輯</span>
                </UncontrolledTooltip>,
                <Button color="light" size="sm"
                    key={deleteId}
                    id={deleteId}
                    disabled={this.state.isAsyncProcessing}
                    onClick={() => this.deleteCategory(categoryId)}>
                    <i className="fas fa-trash-alt"></i>
                </Button>,
                <UncontrolledTooltip placement="top" delay={0}
                    key={deleteId + '_tooltip'}
                    target={deleteId}>
                    <span>刪除</span>
                </UncontrolledTooltip>
            );

            if (this.state.selectedNodeId === categoryId) {
                nodeProps.className = 'selected';
            }
        }
        return nodeProps;
    }

    render() {
        let appId = this.state.appId;
        let appCategories = this.props.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

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
                                <h3 className="mb-4 pt-3 px-3">目錄管理</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 目錄管理</p>
                                <p className="mb-3 pt-0 px-3">管理產品目錄</p>
                            </div>

                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <div className="d-flex flex-row px-3 justify-content-between categories-wrapper">
                                <Card className="px-0 col-12 col-md-5">
                                    <SortableTree treeData={this.state.treeData}
                                        getNodeKey={(categoryNode) => categoryNode.node.categoryId}
                                        canDrag={false}
                                        maxDepth={2}
                                        style={{ height: '24rem' }}
                                        onChange={(treeData) => this.setState({ treeData: treeData })}
                                        generateNodeProps={this.generateNodeProps} />
                                </Card>
                                <Card className="col-12 col-md-6">
                                </Card>
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
        appsCategories: storeState.appsCategories,
        appsProducts: storeState.appsProducts
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Categories)));
