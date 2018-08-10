import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Row, Col, Jumbotron, Button, Input, InputGroup } from 'reactstrap';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import AutoreplyTable from '../Autoreplies/AutoreplyTable.js';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import AutoreplyInsertModal from '../../components/Modals/AutoreplyInsert/AutoreplyInsert';

import './Autoreplies.css';

class Autoreplies extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsAutoreplies: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        browserHlp.setTitle('自動回覆');
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

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

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsAutoreplies.find()
        ]);
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
                <ControlPanel />
                <PageWrapper toolbarTitle="自動回覆">
                    <Fade in className="autoreplies-wrapper">
                        <div className="autoreplies">
                            <Jumbotron>
                                <h1 className="display-3">自動回覆</h1>
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
                            <AutoreplyTable keyword={this.state.searchKeyword} appId={this.state.appId}></AutoreplyTable>
                        </div>
                    </Fade>
                </PageWrapper>

                {this.state.isInsertModalOpen &&
                <AutoreplyInsertModal
                    apps={this.props.apps}
                    isOpen={this.state.isInsertModalOpen}
                    close={this.closeInsertModal}>
                </AutoreplyInsertModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsAutoreplies: storeState.appsAutoreplies
    });
};

export default withRouter(connect(mapStateToProps)(Autoreplies));
