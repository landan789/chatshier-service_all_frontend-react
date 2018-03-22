import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade, Row, Col, Jumbotron, Breadcrumb, BreadcrumbItem, Button, Input, InputGroup } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import AutoreplyTable from '../Autoreplies/AutoreplyTable.js';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import AutoreplyInsertModal from '../../components/Modals/AutoreplyInsert/AutoreplyInsert';

import './Autoreplies.css';

class Autoreplies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isInsertModalOpen: false,
            searchKeyword: '',
            appId: ''
        };

        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
        this.appChanged = this.appChanged.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('自動回覆');

        if (!cookieHelper.hasSignedin()) {
            return authHelper.signOut().then(() => {
                this.props.history.replace(ROUTES.SIGNIN);
            });
        }
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;

            return Promise.all([
                dbapi.apps.findAll(userId),
                dbapi.appsAutoreplies.findAll(null, userId)
            ]);
        });
    }

    keywordChanged(event) {
        this.setState({ searchKeyword: event.target.value });
    }

    openInsertModal() {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal() {
        this.setState({ isInsertModalOpen: false });
    }

    appChanged(appId) {
        // 處理table資料
        this.setState({appId});
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar">
                    <div className="Greetings">
                        <Jumbotron>
                            <h1 className="display-3">自動回覆</h1>
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/">首頁</Link></BreadcrumbItem>
                                <BreadcrumbItem><Link to="#">訊息</Link></BreadcrumbItem>
                                <BreadcrumbItem active>自動回覆</BreadcrumbItem>
                            </Breadcrumb>
                            <Row>
                                <Col>
                                    <AppsSelector onChange={this.appChanged} />
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            className="ticket-search-bar lean-right"
                                            placeholder="搜尋"
                                            value={this.state.searchKeyword}
                                            onChange={this.keywordChanged} />
                                        <Button color="primary" className="pointer lean-right" onClick={this.openInsertModal}>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </InputGroup>
                                    <AutoreplyInsertModal
                                        apps={this.props.apps}
                                        isOpen={this.state.isInsertModalOpen}
                                        close={this.closeInsertModal}>
                                    </AutoreplyInsertModal>
                                </Col>
                            </Row>
                        </Jumbotron>
                        <AutoreplyTable keyword={this.state.searchKeyword} appId={this.state.appId}></AutoreplyTable>
                    </div>
                </Fade>
            </Aux>
        );
    }
}

Autoreplies.propTypes = {
    apps: PropTypes.object,
    appsAutoreplies: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        apps: state.apps,
        appsAutoreplies: state.appsAutoreplies
    };
};

export default withRouter(connect(mapStateToProps)(Autoreplies));