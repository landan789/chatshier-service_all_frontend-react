import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';
import { Table, Button } from 'reactstrap';

import KeywordreplyEditModal from '../../components/Modals/KeywordreplyEdit/KeywordreplyEdit';
import authHelper from '../../helpers/authentication';
import dbapi from '../../helpers/databaseApi/index';
import { notify } from '../../components/Notify/Notify';

class KeywordreplyTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            keyword: '',
            editModalData: null
        };

        this.updateAppId = this.updateAppId.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.updatekeywordSearch = this.updatekeywordSearch.bind(this);
    }
    componentWillReceiveProps(nextProp) {
        let appId = nextProp.appId;
        let keywordreplies = nextProp.appsKeywordreplies[appId] || {};
        let keywordreplyId = Object.keys(keywordreplies);
        if (0 < keywordreplyId.length) {
            this.updateAppId(appId);
        }
        this.updatekeywordSearch(nextProp.keyword);
    }
    updateAppId(appId) {
        this.setState({appId});
    }
    updatekeywordSearch(keyword) {
        this.setState({keyword});
    }
    openEditModal(appId, keywordreplyId, keywordreply) {
        this.setState({
            editModalData: {
                appId, keywordreplyId, keywordreply
            }
        });
    }
    closeEditModal() {
        this.setState({ editModalData: null });
    }
    removekeywordreply(appId, keywordreplyId) {
        let userId = authHelper.userId;
        return dbapi.appsKeywordreplies.delete(appId, keywordreplyId, userId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }
    renderKeywordreplies(status, appId, keyword) {
        let keywordreplies = this.props.appsKeywordreplies[appId] ? this.props.appsKeywordreplies[appId].keywordreplies : {};
        let keywordreplyIds = Object.keys(keywordreplies);
        let statusList = keywordreplyIds.filter((keywordreplyId) => status === keywordreplies[keywordreplyId].status);
        let newIdList;
        if (keyword || 0 < keyword.length) {
            newIdList = statusList.filter((keywordreplyId) => keywordreplies[keywordreplyId].keyword.includes(keyword) || keywordreplies[keywordreplyId].text.includes(keyword));
        } else {
            newIdList = statusList;
        }
        return newIdList.map((keywordreplyId, index) => {
            let keywordreply = keywordreplies[keywordreplyId];
            if (0 === Object.keys(keywordreply).length) {
                return null;
            }
            return (
                <tr key={index}>
                    <td>{keywordreply.keyword}</td>
                    <td>{keywordreply.text}</td>
                    <td>{keywordreply.replyCount}</td>
                    <td>
                        <Button color="secondary" onClick={() => this.openEditModal(appId, keywordreplyId, keywordreplies[keywordreplyId])}><i className="fas fa-pencil-alt"></i></Button>{' '}
                        <Button color="danger" onClick={() => this.removekeywordreply(appId, keywordreplyId)}><i className="fas fa-trash-alt"></i></Button>
                    </td>
                </tr>
            );
        });
    }
    render() {
        return (
            <Aux>
                <h4>開放</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">關鍵字</th>
                            <th scope="col">內容</th>
                            <th scope="col">回應次數</th>
                            <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderKeywordreplies(true, this.state.appId, this.state.keyword)}
                    </tbody>
                </Table>
                <h4>草稿</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">關鍵字</th>
                            <th scope="col">內容</th>
                            <th scope="col">回應次數</th>
                            <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderKeywordreplies(false, this.state.appId, this.state.keyword)}
                    </tbody>
                </Table>
                <KeywordreplyEditModal
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </KeywordreplyEditModal>
            </Aux>
        );
    }
}

KeywordreplyTable.propTypes = {
    appsKeywordreplies: PropTypes.object,
    appId: PropTypes.string,
    keyword: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
    return {
        appsKeywordreplies: state.appsKeywordreplies
    };
};

export default connect(mapStateToProps)(KeywordreplyTable);
