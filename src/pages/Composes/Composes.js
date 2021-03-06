import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Jumbotron, Row, Col, InputGroup, Input, Button } from 'reactstrap';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ComposeInsertModal from '../../components/Modals/ComposeInsert/ComposeInsert';
import ComposeTable from '../Composes/ComposeTable';

import './Composes.css';

class Composes extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsFields: PropTypes.object,
        appsComposes: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        browserHlp.setTitle('群發');
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.state = {
            isInsertModalOpen: false,
            appId: '',
            searchKeyword: ''
        };

        this.appChanged = this.appChanged.bind(this);
        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsComposes.find(),
            apiDatabase.appsFields.find()
        ]);
    }

    appChanged(appId) {
        this.setState({ appId });
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

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle="群發">
                    <Fade in className="composes-wrapper">
                        <div className="composes">
                            <Jumbotron>
                                <h1 className="display-3">群發</h1>
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
                                    </Col>
                                </Row>
                            </Jumbotron>
                            <ComposeTable appId={this.state.appId} keyword={this.state.searchKeyword} />
                        </div>
                    </Fade>
                </PageWrapper>

                {this.state.isInsertModalOpen &&
                <ComposeInsertModal
                    apps={this.props.apps}
                    appsFields={this.props.appsFields}
                    isOpen={this.state.isInsertModalOpen}
                    close={this.closeInsertModal}>
                </ComposeInsertModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsFields: storeState.appsFields,
        appsComposes: storeState.appsComposes
    });
};

export default withRouter(connect(mapStateToProps)(Composes));
