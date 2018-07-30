import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Button, Card } from 'reactstrap';
import { withTranslate } from '../../i18n';
import { HOUR } from '../../utils/unitTime';

import apiDatabase from '../../helpers/apiDatabase/index';

import AppsSelector from '../../components/AppsSelector/AppsSelector';
import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';

import './Receptionists.css';

class Receptionists extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        appsReceptionists: PropTypes.object
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            appId: ''
        };

        this.appChanged = this.appChanged.bind(this);
        this.insertReceptionist = this.insertReceptionist.bind(this);
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

    insertReceptionist() {
        let receptionist = {
            name: '王醫師',
            photo: 'https://www.everydayhealth.com.tw/upload/columnist/23653f50520000008e0d.jpg',
            gmail: '9thflr.minghepan@gmail.com',
            phone: '0932641200',
            timezoneOffset: new Date().getTimezoneOffset(),
            maxNumber: 3,
            interval: HOUR,
            schedules: [{
                startedTime: new Date('2018-07-28 08:00:00'),
                endedTime: new Date('2018-07-28 18:00:00')
            }, {
                startedTime: new Date('2018-07-29 08:00:00'),
                endedTime: new Date('2018-07-29 18:00:00')
            }, {
                startedTime: new Date('2018-07-30 08:00:00'),
                endedTime: new Date('2018-07-30 18:00:00')
            }, {
                startedTime: new Date('2018-07-31 08:00:00'),
                endedTime: new Date('2018-07-31 18:00:00')
            }]
        };

        let appId = this.state.appId;
        return apiDatabase.appsReceptionists.insert(appId, receptionist);
    }

    updateReceptionist(receptionistId) {
        let receptionist = {
            name: '新王醫師'
        };

        let appId = this.state.appId;
        return apiDatabase.appsReceptionists.update(appId, receptionistId, receptionist);
    }

    deleteReceptionist(receptionistId) {
        let appId = this.state.appId;
        return apiDatabase.appsReceptionists.delete(appId, receptionistId);
    }

    render() {
        let appId = this.state.appId;
        let appReceptionists = this.props.appsReceptionists[appId] || { receptionists: {} };
        /** @type {Chatshier.Models.Receptionists} */
        let receptionists = appReceptionists.receptionists;

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Receptionist management')}>
                    <Fade in className="align-items-center mt-5 container category-wrapper">
                        <Card className="pb-3 chsr">
                            <div className="text-left table-title">
                                <h3 className="mb-4 pt-3 px-3">服務人員管理</h3>
                                <p className="mb-3 pt-0 px-3">首頁 / 預約系統 / 服務人員管理</p>
                                <p className="mb-3 pt-0 px-3">新增、更新或刪除服務人員；向服務人員共享機器人預約行事曆</p>
                            </div>
                            <AppsSelector className="px-3 my-3" onChange={this.appChanged} />

                            <Button color="info" onClick={this.insertReceptionist}>新增服務人員</Button>
                            <div className="receptionists-wrapper">
                                {Object.keys(receptionists).map((receptionistId) => {
                                    let receptionist = receptionists[receptionistId];
                                    return (
                                        <Aux key={receptionistId}>
                                            <div>receptionistId: {receptionistId}</div>
                                            <div><img src={receptionist.photo} alt={receptionist.name} /></div>
                                            <div>服務人員名稱: {receptionist.name}</div>
                                            <div>服務時段間隔: {(receptionist.interval / HOUR) + ' 小時'}</div>
                                            <Button color="primary" onClick={() => this.updateReceptionist(receptionistId)}>更新服務人員</Button>
                                            <Button color="danger" onClick={() => this.deleteReceptionist(receptionistId)}>刪除服務人員</Button>
                                        </Aux>
                                    );
                                })}
                            </div>
                        </Card>
                    </Fade>
                </PageWrapper>
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

export default withRouter(withTranslate(connect(mapStateToProps)(Receptionists)));
