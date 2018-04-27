import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Jumbotron, Row, Col, InputGroup, Input, Button } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import { setNavTitle } from '../../components/Navigation/Toolbar/Toolbar';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import KeywordreplyTable from '../Keywordreplies/KeywordreplyTable';
import KeywordreplyInsertModal from '../../components/Modals/KeywordreplyInsert/KeywordreplyInsert';

import './Keywordreplies.css';

class Keywordreplies extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsKeywordreplies: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: '',
            appId: '',
            isInsertModalOpen: false
        };

        this.appChanged = this.appChanged.bind(this);
        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('關鍵字回覆');
        setNavTitle('關鍵字回覆');

        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;

        return Promise.all([
            apiDatabase.apps.find(userId),
            apiDatabase.appsKeywordreplies.find(null, userId)
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
                <PageWrapper>
                    <Fade in className="keywordreplies-wrapper">
                        <div className="keywordreplies">
                            <Jumbotron>
                                <h1 className="display-3">關鍵字回覆</h1><br/>
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
                                        <KeywordreplyInsertModal
                                            apps={this.props.apps}
                                            isOpen={this.state.isInsertModalOpen}
                                            close={this.closeInsertModal}>
                                        </KeywordreplyInsertModal>
                                    </Col>
                                </Row>
                            </Jumbotron>
                            <KeywordreplyTable appId={this.state.appId} keyword={this.state.searchKeyword} />
                        </div>
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
        appsKeywordreplies: storeState.appsKeywordreplies
    };
};

export default withRouter(connect(mapStateToProps)(Keywordreplies));
