import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card } from 'reactstrap';
import { withTranslate } from '../../i18n';

import authHelper from '../../helpers/authentication';
import apiDatabase from '../../helpers/apiDatabase/index';

import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';

import './CategoriesProducts.css';

class CategoriesProducts extends React.Component {
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
        this.insertProduct = this.insertProduct.bind(this);
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsCategories.find(void 0, userId)
        ]);
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    insertCategory() {
        let category = {
            parent_id: '5b584521fbddb6197a98e0e6',
            name: '測試類別',
            description: '類別描述_' + Date.now()
        };

        let appId = this.state.appId;
        let userId = authHelper.userId;
        return apiDatabase.appsCategories.insert(appId, userId, category);
    }

    insertProduct() {

    }

    render() {
        let appId = this.state.appId;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Product management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">管理商品</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 商品服務 / 管理商品</p>
                                <p className="mb-3 pt-0 px-3">管理產品類別及項目</p>
                            </div>
                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <Button color="dark" onClick={this.insertCategory}>新增類別</Button>
                            <Button color="info" onClick={this.insertProduct}>新增產品</Button>
                            <div className="categories-wrapper">
                                {appId && Object.keys(this.props.appsCategories[appId].categories)}
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

export default withRouter(withTranslate(connect(mapStateToProps)(CategoriesProducts)));
