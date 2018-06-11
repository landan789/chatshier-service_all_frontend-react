import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import { Table, Button } from 'reactstrap';

import AutoreplyEditModal from '../../components/Modals/AutoreplyEdit/AutoreplyEdit';
import authHelper from '../../helpers/authentication';
import apiDatabase from '../../helpers/apiDatabase/index';
import { notify } from '../../components/Notify/Notify';

class AutoreplyTable extends React.Component {
    static propTypes = {
        appsAutoreplies: PropTypes.object,
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
        this.updateAppId = this.updateAppId.bind(this);
        this.updatekeywordSearch = this.updatekeywordSearch.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProp) {
        let autoreplies = nextProp.appsAutoreplies[nextProp.appId] || {};
        let autoreplyIds = Object.keys(autoreplies);

        if (autoreplyIds.length > 0) {
            this.updateAppId(nextProp.appId);
        }
        this.updatekeywordSearch(nextProp.keyword);
    }

    updateAppId(appId) {
        this.setState({appId});
    }

    updatekeywordSearch(keyword) {
        this.setState({keyword});
    }

    openEditModal(appId, autoreplyId, autoreply) {
        this.setState({
            editModalData: {
                appId, autoreplyId, autoreply
            }
        });
    }

    removeAutoreply(appId, autoreplyId) {
        let userId = authHelper.userId;
        return apiDatabase.appsAutoreplies.delete(appId, autoreplyId, userId).then(() => {
            return notify('刪除成功', { type: 'success' });
        }).catch(() => {
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    closeEditModal() {
        this.setState({ editModalData: null });
    }

    toLocalTimeString(ms) {
        let date = new Date(ms);
        let localDate = date.toLocaleDateString();
        let localTime = date.toLocaleTimeString();
        let localTimeString = localDate + localTime;
        return localTimeString;
    }

    renderAutoreplies(appId, keyword) {
        let autoreplies = this.props.appsAutoreplies[appId] ? this.props.appsAutoreplies[appId].autoreplies : {};
        let autoreplyIds = Object.keys(autoreplies);
        let newIdList = autoreplyIds;
        if (keyword || 0 < keyword.length) {
            newIdList = autoreplyIds.filter((autoreplyId) => autoreplies[autoreplyId].title.includes(keyword) || autoreplies[autoreplyId].text.includes(keyword));
        }
        return newIdList.map((autoreplyId, index) => {
            let autoreply = autoreplies[autoreplyId];
            if (0 === Object.keys(autoreply).length) {
                return null;
            }
            return (
                <tr key={index}>
                    <td className="title">{autoreplies[autoreplyId].title}</td>
                    <td className="time-start">{this.toLocalTimeString(autoreplies[autoreplyId].startedTime)}</td>
                    <td className="time-end">{this.toLocalTimeString(autoreplies[autoreplyId].endedTime)}</td>
                    <td className="text">{autoreplies[autoreplyId].text}</td>
                    <td className="edit">
                        <Button color="secondary" onClick={() => this.openEditModal(appId, autoreplyId, autoreplies[autoreplyId])}><i className="fas fa-pencil-alt"></i></Button>{' '}
                        <Button color="danger" onClick={() => this.removeAutoreply(appId, autoreplyId)}><i className="fas fa-trash-alt"></i></Button>
                    </td>
                </tr>
            );
        });
    }

    render() {
        return (
            <Aux>
                <Table className="AutoreplyTable" striped>
                    <thead>
                        <tr>
                            <th className="title" scope="col">標題</th>
                            <th className="time-start" scope="col">開始時間</th>
                            <th className="time-end" scope="col">結束時間</th>
                            <th className="text" scope="col">訊息內容</th>
                            <th className="edit" scope="col">設定</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderAutoreplies(this.state.appId, this.state.keyword)}
                    </tbody>
                </Table>

                {!!this.state.editModalData &&
                <AutoreplyEditModal
                    modalData={this.state.editModalData}
                    isOpen={!!this.state.editModalData}
                    close={this.closeEditModal}>
                </AutoreplyEditModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return {
        appsAutoreplies: storeState.appsAutoreplies
    };
};

export default connect(mapStateToProps)(AutoreplyTable);
