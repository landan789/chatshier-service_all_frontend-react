import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card, CardBody, Row, Container, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import AnalysisChart from './AnalysisChart';

import './Analysis.css';

class Analysis extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object,
        appsChatrooms: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            selectedAppId: ''
        };

        this.appChanged = this.appChanged.bind(this);
        this.toggleTypeDropdown = this.toggleTypeDropdown.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle(this.props.t('Analysis'));

        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && apiDatabase.appsChatrooms.find(userId);
    }

    componentWillReceiveProps(props) {

    }

    appChanged(appId) {
        this.setState({ selectedAppId: appId });
    }

    toggleTypeDropdown() {
        this.setState({ typeDropdownOpen: !this.state.typeDropdownOpen });
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Analysis')}>
                    <Fade in className="analysis-wrapper">
                        <Container className="mt-5 analysis-container">
                            <Card className="mb-5 chsr analyze-body">
                                <h3 className="page-title">
                                    <Trans i18nKey="Message analysis" />
                                </h3>

                                <CardBody>
                                    <Row>
                                        <AppsSelector className="col-12 col-lg-6 mb-3" onChange={this.appChanged} />
                                        <Dropdown className="col-12 col-lg-6 mb-3 chart-dropdown" isOpen={this.state.typeDropdownOpen} toggle={this.toggleTypeDropdown}>
                                            <DropdownToggle className="btn btn-info" caret color="info">每時段總訊息數</DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className="view-time">每時段總訊息數</DropdownItem>
                                                <DropdownItem className="view-month">單位：月</DropdownItem>
                                                <DropdownItem className="view-date">單位：日</DropdownItem>
                                                <DropdownItem className="view-hour">單位：小時</DropdownItem>
                                                <DropdownItem className="view-cloud">文字頻率分析</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>

                                        <div className="w-100 mt-3 mb-4 px-0 flex-wrap date-wrapper">
                                            <div className="col-12 col-lg-6 mb-2 date-group">
                                                <div className="input-group date">
                                                    <span className="input-group-prepend">
                                                        <span className="input-group-text">
                                                            <i className="far fa-calendar-alt"></i>
                                                        </span>
                                                    </span>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mb-2 date-group">
                                                <div className="input-group date">
                                                    <span className="input-group-prepend">
                                                        <span className="input-group-text">
                                                            <i className="far fa-calendar-alt"></i>
                                                        </span>
                                                    </span>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </Row>

                                    <div className="chart-container">
                                        {!!this.state.selectedAppId &&
                                        <AnalysisChart className="w-100 h-100 mx-auto chart-body"
                                            appId={this.state.selectedAppId}
                                            appsChatrooms={this.props.appsChatrooms} />}
                                    </div>
                                </CardBody>
                            </Card>
                        </Container>
                    </Fade>
                </PageWrapper>
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms
    };
};

export default withRouter(withTranslate(connect(mapStateToProps)(Analysis)));
