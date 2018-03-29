import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade, Jumbotron, Row, Col, InputGroup, Input, Button } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import KeywordreplyTable from '../Keywordreplies/KeywordreplyTable';
import KeywordreplyInsertModal from '../../components/Modals/KeywordreplyInsert/KeywordreplyInsert';

import './Keywordreplies.css';

class Keywordreplies extends React.Component {
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

        if (!cookieHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;

        return Promise.all([
            dbapi.apps.find(userId),
            dbapi.appsKeywordreplies.find(null, userId)
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
                <Toolbar />
                <Fade in className="has-toolbar">
                    <div className="Greetings">
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
            </Aux>
        );
    }
}

Keywordreplies.propTypes = {
    apps: PropTypes.object,
    appsKeywordreplies: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: state.apps,
        appsKeywordreplies: state.appsKeywordreplies
    };
};

export default withRouter(connect(mapStateToProps)(Keywordreplies));
