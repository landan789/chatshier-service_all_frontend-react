import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card, CardBody, CardFooter, UncontrolledTooltip } from 'reactstrap';
import { withTranslate } from '../../i18n';
import { HOUR } from '../../utils/unitTime';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';

import ReceptionistModal from '../../components/Modals/Receptionist/Receptionist';

import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import { notify } from '../../components/Notify/Notify';

import defaultAvatarPng from '../../image/default-avatar.png';

import './Receptionists.css';

class ReceptionistsPage extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsReceptionists: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: '',
            isAsyncProcessing: false
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertReceptionist = this.insertReceptionist.bind(this);
        this.updateReceptionist = this.updateReceptionist.bind(this);
        this.deleteReceptionist = this.deleteReceptionist.bind(this);
        this.closeModal = this.closeModal.bind(this);

        browserHelper.setTitle(this.props.t('服務人員管理'));
        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        return Promise.all([
            apiDatabase.apps.find(),
            apiDatabase.appsReceptionists.find()
        ]);
    }

    appChanged(appId) {
        this.setState({ appId: appId });
    }

    insertReceptionist(receptionist) {
        let postReceptionist = Object.assign({
            timezoneOffset: new Date().getTimezoneOffset(),
            maxNumber: 3,
            interval: HOUR
        }, receptionist);

        if (!postReceptionist.name) {
            return notify('必須輸入服務人員的名稱', { type: 'warning' });
        } else if (!postReceptionist.gmail) {
            return notify('必須輸入服務人員的 Gmail', { type: 'warning' });
        }

        let appId = this.state.appId;
        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionists.insert(appId, postReceptionist).then(() => {
            return this.closeModal();
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify('新增失敗', { type: 'danger' });
        });
    }

    updateReceptionist(receptionistId, receptionist) {
        let appId = this.state.appId;
        let _receptionist = this.props.appsReceptionists[appId].receptionists[receptionistId];
        let putReceptionist = Object.assign({}, _receptionist, receptionist);

        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionists.update(appId, receptionistId, putReceptionist).then(() => {
            return this.closeModal();
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify('更新失敗', { type: 'danger' });
        });
    }

    deleteReceptionist(receptionistId) {
        let appId = this.state.appId;
        this.setState({ isAsyncProcessing: true });
        return apiDatabase.appsReceptionists.delete(appId, receptionistId).then(() => {
            return this.closeModal();
        }).catch(() => {
            this.setState({ isAsyncProcessing: false });
            return notify('刪除失敗', { type: 'danger' });
        });
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            receptionistId: void 0,
            receptionist: void 0
        });
    }

    render() {
        let appId = this.state.appId;
        let appReceptionists = this.props.appsReceptionists[appId] || { receptionists: {} };
        /** @type {Chatshier.Models.Receptionists} */
        let receptionists = appReceptionists.receptionists;
        let receptionistIds = Object.keys(receptionists).sort((a, b) => {
            let tA = new Date(receptionists[a].updatedTime);
            let tB = new Date(receptionists[b].updatedTime);

            if (tA < tB) {
                return 1;
            } else if (tA > tB) {
                return -1;
            } else {
                return 0;
            }
        });

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Receptionist management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">服務人員管理</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 服務人員管理</p>
                                <p className="mb-3 pt-0 px-3 text-muted small">新增、更新或刪除服務人員；向服務人員共享機器人預約行事曆</p>
                            </div>

                            <div className="d-flex flex-nowrap justify-content-between">
                                <AppsSelector className="px-3 my-3" onChange={this.appChanged} />
                                <div className="px-3 my-3 btn-group">
                                    <Button color="light" className="btn-border" onClick={() => this.setState({ receptionist: {} })}>
                                        <i className="fas fa-plus"></i>
                                    </Button>
                                </div>
                            </div>

                            <div className="px-3 pt-0 card-deck receptionists-wrapper">
                                {receptionistIds.map((receptionistId) => {
                                    let receptionist = receptionists[receptionistId];
                                    let appointmentIds = receptionist.appointment_ids || [];
                                    return (
                                        <Card key={receptionistId} className="mt-3 receptionist-item">
                                            <CardBody className="p-2 text-center">
                                                <div className="mx-auto image-container">
                                                    <img className="image-fit" src={receptionist.photo || defaultAvatarPng} alt={receptionist.name} />
                                                </div>
                                                <div className="mt-2">{receptionist.name}</div>
                                                <div className="small">{receptionist.gmail}</div>
                                            </CardBody>

                                            <CardFooter className="pb-4 card-footer flex-column">
                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-stopwatch fa-fw fa-1p5x"></i>
                                                    <span className="small">預約間隔 {(receptionist.interval / HOUR).toFixed(1)} 小時</span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-calendar-check fa-fw fa-1p5x"></i>
                                                    <span className="small">被預約次數 {appointmentIds.length} 次</span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-handshake fa-fw fa-1p5x"></i>
                                                    <span className="small">行事曆 {receptionist.gcalendarId ? '已連結' : '未連結'}</span>
                                                </div>

                                                <div className="mt-2 d-flex justify-content-around">
                                                    <Button color="light" id={'receptionistEditBtn_' + receptionistId}
                                                        onClick={() => {
                                                            this.setState({
                                                                receptionistId: receptionistId,
                                                                receptionist: this.props.appsReceptionists[appId].receptionists[receptionistId]
                                                            });
                                                        }}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'receptionistEditBtn_' + receptionistId}>編輯</UncontrolledTooltip>

                                                    <Button color="light" id={'calendarLinkBtn_' + receptionistId}
                                                        onClick={() => this.updateReceptionist(receptionistId)}
                                                        disabled={!!receptionist.gcalendarId || this.state.isAsyncProcessing}>
                                                        <i className="fas fa-calendar-plus"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'calendarLinkBtn_' + receptionistId}>連結行事曆</UncontrolledTooltip>

                                                    <Button color="light" id={'receptionistDeleteBtn_' + receptionistId}
                                                        onClick={() => this.deleteReceptionist(receptionistId)}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'receptionistDeleteBtn_' + receptionistId}>刪除</UncontrolledTooltip>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>

                {this.state.receptionist &&
                <ReceptionistModal
                    isOpen={!!this.state.receptionist}
                    isUpdate={!!this.state.receptionistId}
                    appId={this.state.appId}
                    receptionistId={this.state.receptionistId}
                    receptionist={this.state.receptionist}
                    insertHandler={this.insertReceptionist}
                    updateHandler={this.updateReceptionist}
                    deleteHandler={this.deleteReceptionist}
                    onAppChange={this.appChanged}
                    close={this.closeModal} />}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        appsReceptionists: storeState.appsReceptionists
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(ReceptionistsPage)));
