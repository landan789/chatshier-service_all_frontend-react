import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card, CardBody, CardFooter, UncontrolledTooltip } from 'reactstrap';
import { withTranslate } from '../../i18n';
import { Trans } from 'react-i18next';
import { HOUR } from '../../utils/unitTime';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';
import apiImage from '../../helpers/apiImage/index';
import regex from '../../utils/regex';

import confirmDialog from '../../components/Modals/Confirm/Confirm';
import ReceptionistModal from '../../components/Modals/Receptionist/Receptionist';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import { notify } from '../../components/Notify/Notify';

import defaultConsumerImg from '../../image/default-consumer.png';

import SchedulePanel from './SchedulePanel';
import './Receptionists.css';

const UNAVAILABLE_GMAIL = '2.6';

class ReceptionistsPage extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsReceptionists: PropTypes.object,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHlp.setTitle(props.t('Receptionist management'));
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.state = {
            appId: '',
            isOpenSchedulePanel: false,
            isAsyncProcessing: false
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertReceptionist = this.insertReceptionist.bind(this);
        this.updateReceptionist = this.updateReceptionist.bind(this);
        this.removeReceptionist = this.removeReceptionist.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeSchedulesPanel = this.closeSchedulesPanel.bind(this);
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
            timezoneOffset: new Date().getTimezoneOffset()
        }, receptionist);

        if (!postReceptionist.name) {
            return notify('必須輸入服務人員的名稱', { type: 'warning' });
        } else if (!postReceptionist.email) {
            return notify('必須輸入服務人員的 Gmail', { type: 'warning' });
        } else if (!regex.emailStrict.test(postReceptionist.email)) {
            return notify(this.props.t('Invalid email'), { type: 'warning' });
        }

        let appId = this.state.appId;
        let fromPath;

        this.setState({ isAsyncProcessing: true });
        return Promise.resolve().then(() => {
            if (!(postReceptionist && postReceptionist.photo && postReceptionist.photo instanceof File)) {
                return;
            }

            return apiImage.uploadFile.post(postReceptionist.photo).then((resJson) => {
                postReceptionist.photo = resJson.data.url;
                fromPath = resJson.data.originalFilePath;
            });
        }).then(() => {
            return apiDatabase.appsReceptionists.insert(appId, postReceptionist);
        }).then((resJson) => {
            if (!fromPath) {
                return;
            }

            let _appsReceptionists = resJson.data;
            let receptionistId = Object.keys(_appsReceptionists[appId].receptionists).shift();
            let fileName = fromPath.split('/').pop();
            let toPath = '/apps/' + appId + '/receptionists/' + receptionistId + '/photo/' + fileName;
            return apiImage.moveFile.post(fromPath, toPath);
        }).then(() => {
            this.closeModal();
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).catch((err) => {
            this.setState({ isAsyncProcessing: false });
            if (err && UNAVAILABLE_GMAIL === err.code) {
                return notify('必須使用有註冊的 Gmail 帳號', { type: 'danger' });
            }
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    updateReceptionist(receptionistId, receptionist) {
        let appId = this.state.appId;
        let fromPath;
        let _receptionist = this.props.appsReceptionists[appId].receptionists[receptionistId];
        let putReceptionist = Object.assign({}, _receptionist, receptionist);

        this.setState({ isAsyncProcessing: true });
        return Promise.resolve().then(() => {
            if (putReceptionist && putReceptionist.photo && putReceptionist.photo instanceof File) {
                return apiImage.uploadFile.post(putReceptionist.photo).then((resJson) => {
                    putReceptionist.photo = resJson.data.url;
                    fromPath = resJson.data.originalFilePath;
                    return putReceptionist;
                });
            }
        }).then(() => {
            return apiDatabase.appsReceptionists.update(appId, receptionistId, putReceptionist);
        }).then(() => {
            if (!fromPath) {
                return;
            }

            let fileName = fromPath.split('/').pop();
            let toPath = '/apps/' + appId + '/receptionists/' + receptionistId + '/photo/' + fileName;
            return apiImage.moveFile.post(fromPath, toPath);
        }).then(() => {
            this.closeModal();
            return notify(this.props.t('Update successful!'), { type: 'success' });
        }).catch((err) => {
            this.setState({ isAsyncProcessing: false });
            if (err && UNAVAILABLE_GMAIL === err.code) {
                return notify('必須使用有註冊的 Gmail 帳號', { type: 'danger' });
            }
            return notify(this.props.t('An error occurred!'), { type: 'danger' });
        });
    }

    removeReceptionist(receptionistId) {
        return confirmDialog({
            title: '刪除確認',
            message: '確定要刪除這個服務人員嗎？',
            confirmText: this.props.t('Confirm'),
            confirmColor: 'danger',
            cancelText: this.props.t('Cancel')
        }).then((isConfirm) => {
            if (!isConfirm) {
                return;
            }

            let appId = this.state.appId;
            this.setState({ isAsyncProcessing: true });
            return apiDatabase.appsReceptionists.remove(appId, receptionistId).then(() => {
                this.closeModal();
                return notify(this.props.t('Remove successful!'), { type: 'success' });
            }).catch(() => {
                this.setState({ isAsyncProcessing: false });
                return notify(this.props.t('An error occurred!'), { type: 'danger' });
            });
        });
    }

    closeModal() {
        this.setState({
            isAsyncProcessing: false,
            receptionistId: void 0,
            receptionist: void 0
        });
    }

    closeSchedulesPanel() {
        this.setState({
            isOpenSchedulePanel: false,
            receptionistId: void 0
        });
    }

    render() {
        if (!this.state) {
            return null;
        }

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
                    <Fade in className="align-items-center mt-5 pb-4 container category-wrapper">
                        <Card className="pb-3 shadow chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3"><Trans i18nKey="Receptionist management" /></h3>
                                <p className="mb-3 pt-0 px-3"><Trans i18nKey="Home" /> / <Trans i18nKey="Appointment system" /> / <Trans i18nKey="Receptionist management" /></p>
                                <p className="mb-3 pt-0 px-3 text-muted small">新增、更新或刪除服務人員</p>
                            </div>

                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <div className="px-3 pt-0 d-flex flex-wrap receptionists-wrapper">
                                <Card className="w-100 m-2 shadow-sm add-btn" onClick={() => this.setState({ receptionist: {} })}>
                                    <i className="m-auto fas fa-plus fa-2x"></i>
                                </Card>
                                {receptionistIds.map((receptionistId) => {
                                    let receptionist = receptionists[receptionistId];

                                    return (
                                        <Card key={receptionistId} className="d-inline-block w-100 m-2 shadow-sm receptionist-item">
                                            <CardBody className="p-2 text-center bg-transparent">
                                                <div className="mx-auto image-container border-circle">
                                                    <img className="image-fit border-circle" src={receptionist.photo || defaultConsumerImg} alt={receptionist.name} />
                                                </div>
                                                <div className="mt-2 font-weight-bold text-info">{receptionist.name}</div>
                                                <div className="text-muted small">{receptionist.email}</div>
                                            </CardBody>

                                            <CardFooter className="pb-4 card-footer flex-column d-inherit border-none bg-transparent">
                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-stopwatch fa-fw fa-1p5x"></i>
                                                    <span className="small">預約間隔
                                                        <span className="text-primary ml-1">
                                                            {(receptionist.interval / HOUR).toFixed(1)} 小時
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-hand-point-up fa-fw fa-1p5x"></i>
                                                    <span className="small">
                                                        每日預約上限數
                                                        <span className="text-primary ml-1">
                                                            { 'number' === typeof receptionist.maxNumberPerDay && receptionist.maxNumberPerDay ? receptionist.maxNumberPerDay + ' 次' : '不設限'}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-calendar-check fa-fw fa-1p5x"></i>
                                                    <span className="small">
                                                        被預約次數
                                                        <span className="text-primary ml-1">{receptionist.timesOfAppointment} 次</span>
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center mb-2 text-muted">
                                                    <i className="mr-2 fas fa-handshake fa-fw fa-1p5x"></i>
                                                    <span className="small">
                                                        行事曆
                                                        {receptionist.isCalendarShared ? <span className="text-success ml-1">已分享</span> : <span className="text-danger ml-1">未分享</span>}
                                                    </span>
                                                </div>

                                                <div className="mt-2 d-flex justify-content-around">
                                                    <Button color="light" id={'receptionistEditBtn_' + receptionistId}
                                                        onClick={() => {
                                                            this.setState({
                                                                receptionistId: receptionistId,
                                                                receptionist: receptionists[receptionistId]
                                                            });
                                                        }}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'receptionistEditBtn_' + receptionistId}>編輯</UncontrolledTooltip>

                                                    {receptionist.isCalendarShared &&
                                                    <Button color="light"
                                                        onClick={() => {
                                                            this.setState({
                                                                isOpenSchedulePanel: true,
                                                                receptionistId: receptionistId
                                                            });
                                                        }}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </Button>}

                                                    {!receptionist.isCalendarShared &&
                                                    <Button color="light" id={'calendarShareBtn_' + receptionistId}
                                                        onClick={() => this.updateReceptionist(receptionistId, { shareTo: receptionist.email })}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-calendar-plus"></i>
                                                    </Button>}
                                                    {!receptionist.isCalendarShared &&
                                                    <UncontrolledTooltip placement="top" delay={0} target={'calendarShareBtn_' + receptionistId}>分享行事曆</UncontrolledTooltip>}

                                                    <Button color="light" id={'receptionistRemoveBtn_' + receptionistId}
                                                        onClick={() => this.removeReceptionist(receptionistId)}
                                                        disabled={this.state.isAsyncProcessing}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                    <UncontrolledTooltip placement="top" delay={0} target={'receptionistRemoveBtn_' + receptionistId}>刪除</UncontrolledTooltip>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Card>
                    </Fade>
                    {this.state.isOpenSchedulePanel &&
                    <SchedulePanel appId={this.state.appId}
                        receptionistId={this.state.receptionistId}
                        onClose={this.closeSchedulesPanel} />}
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
                    removeHandler={this.removeReceptionist}
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
