import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fade, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Table } from 'reactstrap';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import cookieHelper from '../../helpers/cookie';
import dbapi from '../../helpers/databaseApi/index';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import AutoreplyInsertModal from '../../components/Modals/AutoreplyInsert/AutoreplyInsert';

import './Autoreply.css';

class Autoreply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            isInsertModalOpen: false,
            searchKeyword: '',
            dropdownSelectedApp: 'Apps'
        };
        this.toggle = this.toggle.bind(this);
        this.keywordChanged = this.keywordChanged.bind(this);
        this.openInsertModal = this.openInsertModal.bind(this);
        this.closeInsertModal = this.closeInsertModal.bind(this);
    }

    componentWillMount() {
        browserHelper.setTitle('待辦事項');
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

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    keywordChanged(event) {
        this.setState({ searchKeyword: event.target.value });
    }

    DropdownItemChanged(name) {
        this.setState({ dropdownSelectedApp: name });
        // 後續還要渲染table
    }

    openInsertModal(ev) {
        this.setState({ isInsertModalOpen: true });
    }

    closeInsertModal(ev, role, modalData) {
        this.setState({ isInsertModalOpen: false });
    }

    render() {
        let apps = 0 === Object.keys(this.props.apps).length ? {} : this.props.apps;
        let appsAutoreplies = 0 === Object.keys(this.props.appsAutoreplies).length ? {} : this.props.appsAutoreplies;
        let appIds = Object.keys(apps).filter((id) => ('' !== apps[id].id1.trim()));
        return (
            <Aux>
                <Toolbar />
                <Fade in className="has-toolbar autoreply-wrapper">
                    <Container>
                        <div className="autoreply-panel">
                            <div className="title title-top">
                                <h3 className="padding-lr h3-padding"> 自動回覆訊息</h3>
                                <hr className="hr-margin-bottom" />
                                <p className="address padding-lr"> 首頁 / 訊息 / 自動回覆</p>
                                <p className="address padding-lr">當用戶對LINE@傳送訊息，訊息將自動回覆</p>
                            </div>
                            <Row className="padding-lr">
                                <Col>
                                    <Dropdown color="info" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                        <DropdownToggle caret>{this.state.dropdownSelectedApp}</DropdownToggle>
                                        <DropdownMenu>
                                            { appIds.map((id, index) => <DropdownItem key={index} id={id} onClick={() => { this.DropdownItemChanged(apps[id].name); }}>{apps[id].name}</DropdownItem>) }
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                                <Col>
                                    <span className="icon"><i className="fa fa-search"></i></span>{' '}
                                    <input
                                        type="text"
                                        className="ticket-search-bar"
                                        placeholder="搜尋"
                                        value={this.state.searchKeyword}
                                        onChange={this.keywordChanged} />{' '}
                                    <i className="pointer fas fa-plus" onClick={this.openInsertModal}></i>
                                    <AutoreplyInsertModal
                                        apps={apps}
                                        appsAutoreplies={appsAutoreplies}
                                        isOpen={this.state.isInsertModalOpen}
                                        close={this.closeInsertModal}>
                                    </AutoreplyInsertModal>
                                </Col>
                            </Row>
                            <div className="padding-lr">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th scope="col">標題</th>
                                            <th scope="col">開始時間</th>
                                            <th scope="col">結束時間</th>
                                            <th scope="col">訊息內容</th>
                                            <th scope="col">編輯/刪除</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Container>
                </Fade>
            </Aux>
        );
    }
}

Autoreply.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Autoreply));
