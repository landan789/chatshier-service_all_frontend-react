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
import { notify } from '../../components/Notify/Notify';

import './Categories.css';

class Categories extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsCategories: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: ''
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertCategory = this.insertCategory.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsCategories.find()
        ]);
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    insertCategory(category) {
        let postCategory = Object.assign({
            parent_id: ''
        }, category);

        let appId = this.state.appId;
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
        let _category = this.props.appsCategories[appId].categories[categoryId];
        let putCategory = Object.assign({}, _category, category);

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
        return apiDatabase.appsCategories.delete(appId, categoryId).then(() => {
            this.closeModal();
            return notify(this.props.t('Remove successful!'), { type: 'success' });
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    render() {
        let appId = this.state.appId;
        let appCategories = this.props.appsCategories[appId] || { categories: {} };
        /** @type {Chatshier.Models.Categories} */
        let categories = appCategories.categories;

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

                            <Button color="info" onClick={this.insertCategory}>新增目錄</Button>
                            <div className="categories-wrapper">
                                {Object.keys(categories).map((categoryId) => {
                                    let category = categories[categoryId];
                                    let productIds = category.product_ids || [];

                                    return (
                                        <Aux key={categoryId}>
                                            <div>目錄名稱: {category.name}</div>
                                            <div>目錄描述: {category.description}</div>
                                            <div>目錄商品數: {productIds.length}</div>
                                            <Button color="primary" onClick={() => this.updateCategory(categoryId)}>更新目錄</Button>
                                            <Button color="danger" onClick={() => this.deleteCategory(categoryId)}>刪除目錄</Button>
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
        appsCategories: storeState.appsCategories
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Categories)));
