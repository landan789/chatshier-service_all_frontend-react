import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { Table, Button } from 'reactstrap';

// import ComposeEditModal from '../../components/Modals/ComposeEdit/ComposeEdit';
import authHelper from '../../helpers/authentication';
import dbapi from '../../helpers/databaseApi/index';
import { notify } from '../../components/Notify/Notify';

class ComposeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appId: '',
            keyword: '',
            editModalData: null
        };

        this.RESERVED = 'RESERVED';
        this.SENT = 'SENT';

        this.updateAppId = this.updateAppId.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.updatekeywordSearch = this.updatekeywordSearch.bind(this);
    }
    componentWillReceiveProps(nextProp) {
        let appId = nextProp.appId;
        let composes = nextProp.appsComposes[appId] || {};
        let composeIds = Object.keys(composes);
        if (0 < composeIds.length) {
            this.updateAppId(appId);
        }
        this.updatekeywordSearch(nextProp.keyword);
    }
    updateAppId(appId) {
        this.setState({ appId });
    }
    openEditModal(appId, composeId, compose) {
        this.setState({
            editModalData: {
                appId, composeId, compose
            }
        });
    }
    closeEditModal() {
        this.setState({ editModalData: null });
    }
    updatekeywordSearch(keyword) {
        this.setState({ keyword });
    }
    removeCompose(appId, composeId) {
        let userId = authHelper.userId;
        return dbapi.appsComposes.delete(appId, composeId, userId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }
    toLocalTimeString(ms) {
        let date = new Date(ms);
        let localDate = date.toLocaleDateString();
        let localTime = date.toLocaleTimeString();
        let localTimeString = localDate + localTime;
        return localTimeString;
    }
    renderComposes(status, appId, keyword, determineSentTime) { // status 0: draft, 1: history, reserved
        let composes = this.props.appsComposes[appId] ? this.props.appsComposes[appId].composes : {};
        let composeIds = Object.keys(composes);
        let statusList = composeIds.filter((composeId) => status === composes[composeId].status);
        let newIdList;
        switch (determineSentTime) {
            case this.RESERVED:
                statusList = statusList.filter((composeId) => Date.now() < composes[composeId].time);
                break;
            case this.SENT:
                statusList = statusList.filter((composeId) => Date.now() >= composes[composeId].time);
                break;
            default:
        }
        if (keyword || 0 < keyword.length) {
            newIdList = statusList.filter((composeId) => composes[composeId].keyword.includes(keyword) || composes[composeId].text.includes(keyword));
        } else {
            newIdList = statusList;
        }
        return newIdList.map((composeId, index) => {
            let keywordreply = composes[composeId];
            if (0 === Object.keys(keywordreply).length) {
                return null;
            }
            return (
                <tr key={index}>
                    <td>{keywordreply.text}</td>
                    <td>{this.toLocalTimeString(keywordreply.time)}</td>
                    <td>{'無'}</td>
                    <td>
                        <Button color="secondary" onClick={() => this.openEditModal(appId, composeId, composes[composeId])}><i className="fas fa-pencil-alt"></i></Button>{' '}
                        <Button color="danger" onClick={() => this.removeCompose(appId, composeId)}><i className="fas fa-trash-alt"></i></Button>
                    </td>
                </tr>
            );
        });
    }
    render() {
        return (
            <Aux>
                <h4>預約</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">內容</th>
                            <th scope="col">時間</th>
                            <th scope="col">分類項目</th>
                            <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(1, this.state.appId, this.state.keyword, this.RESERVED)}
                    </tbody>
                </Table>
                <h4>歷史</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">內容</th>
                            <th scope="col">時間</th>
                            <th scope="col">分類項目</th>
                            <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(1, this.state.appId, this.state.keyword, this.SENT)}
                    </tbody>
                </Table>
                <h4>草稿</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">內容</th>
                            <th scope="col">時間</th>
                            <th scope="col">分類項目</th>
                            <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(0, this.state.appId, this.state.keyword, null)}
                    </tbody>
                </Table>
                {/* <ComposeEditModal
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </ComposeEditModal> */}
            </Aux>
        );
    }
}

ComposeTable.propTypes = {
    appsComposes: PropTypes.object,
    appId: PropTypes.string,
    keyword: PropTypes.string
};

export default ComposeTable;
