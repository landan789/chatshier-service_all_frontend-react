import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';
import { Table, Button } from 'reactstrap';

import ComposeEditModal from '../../components/Modals/ComposeEdit/ComposeEdit';
import authHelper from '../../helpers/authentication';
import apiDatabase from '../../helpers/apiDatabase/index';
import { notify } from '../../components/Notify/Notify';
import timeHelper from '../../helpers/timer';

class ComposeTable extends React.Component {
    static propTypes = {
        appsComposes: PropTypes.object,
        appsFields: PropTypes.object,
        appId: PropTypes.string,
        keyword: PropTypes.string
    }

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
    openEditModal(appId, composeId, compose, appsFields) {
        this.setState({
            editModalData: {
                appId, composeId, compose, appsFields
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
        return apiDatabase.appsComposes.delete(appId, composeId, userId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }
    renderComposes(status, appId, keyword, determineSentTime) { // status 0(false): draft, 1(true): history, reserved
        let composes = this.props.appsComposes[appId] ? this.props.appsComposes[appId].composes : {};
        let composeIds = Object.keys(composes);
        let statusList = composeIds.filter((composeId) => status === composes[composeId].status);
        let newIdList;
        switch (determineSentTime) {
            case this.RESERVED:
                statusList = statusList.filter((composeId) => Date.now() < timeHelper.toMilliseconds(composes[composeId].time));
                break;
            case this.SENT:
                statusList = statusList.filter((composeId) => Date.now() >= timeHelper.toMilliseconds(composes[composeId].time));
                break;
            default:
        }
        if (keyword || 0 < keyword.length) {
            newIdList = statusList.filter((composeId) => composes[composeId].text.includes(keyword));
        } else {
            newIdList = statusList;
        }
        return newIdList.map((composeId, index) => {
            let compose = composes[composeId];
            if (0 === Object.keys(compose).length) {
                return null;
            }
            return (
                <tr key={index}>
                    <td className="text">{compose.text}</td>
                    <td className="time">{timeHelper.toLocalTimeString(compose.time)}</td>
                    <td className="cata">{0 < compose.ageRange || compose.gender || 0 < Object.keys(compose.field_ids) ? '有' : '無'}</td>
                    <td className="edit">
                        <Button color="secondary" onClick={() => this.openEditModal(appId, composeId, composes[composeId], this.props.appsFields[appId])}><i className="fas fa-pencil-alt"></i></Button>
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
                <Table className="Compose" striped>
                    <thead>
                        <tr>
                            <th className="text" scope="col">內容</th>
                            <th className="time" scope="col">時間</th>
                            <th className="cata" scope="col">分類項目</th>
                            <th className="edit" scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(true, this.state.appId, this.state.keyword, this.RESERVED)}
                    </tbody>
                </Table>
                <h4>歷史</h4>
                <Table className="Compose" striped>
                    <thead>
                        <tr>
                            <th className="text" scope="col">內容</th>
                            <th className="time" scope="col">時間</th>
                            <th className="cata" scope="col">分類項目</th>
                            <th className="edit" scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(true, this.state.appId, this.state.keyword, this.SENT)}
                    </tbody>
                </Table>
                <h4>草稿</h4>
                <Table className="Compose" striped>
                    <thead>
                        <tr>
                            <th className="text" scope="col">內容</th>
                            <th className="time" scope="col">時間</th>
                            <th className="cata" scope="col">分類項目</th>
                            <th className="edit" scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderComposes(false, this.state.appId, this.state.keyword, null)}
                    </tbody>
                </Table>

                {!!this.state.editModalData &&
                <ComposeEditModal
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </ComposeEditModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return {
        appsFields: storeState.appsFields,
        appsComposes: storeState.appsComposes
    };
};

export default connect(mapStateToProps)(ComposeTable);
