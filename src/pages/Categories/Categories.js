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

    insertCategory() {
        let category = {
            parent_id: '',
            name: '測試類別',
            description: '類別描述_' + Date.now()
        };

        let appId = this.state.appId;
        return apiDatabase.appsCategories.insert(appId, category);
    }

    updateCategory(categoryId) {
        let category = {
            name: '測試類別_更新',
            description: '類別描述_' + Date.now(),
            product_ids: ['5b5c40c51650cb1f8e1fd270', '5b5c40c91650cb1f8e1fd272']
        };

        let appId = this.state.appId;
        return apiDatabase.appsCategories.update(appId, categoryId, category);
    }

    deleteCategory(categoryId) {
        let appId = this.state.appId;
        return apiDatabase.appsCategories.delete(appId, categoryId);
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
                                    return (
                                        <Aux key={categoryId}>
                                            <div>目錄名稱: {category.name}</div>
                                            <div>目錄描述: {category.description}</div>
                                            <div>目錄商品數: {category.product_ids.length}</div>
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
