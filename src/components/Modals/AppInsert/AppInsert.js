import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../../i18n';
import { Button, Modal, ModalHeader,
    ModalBody, ModalFooter, FormGroup } from 'reactstrap';

import apiDatabase from '../../../helpers/apiDatabase/index';
import fbHlp from '../../../helpers/facebook';

import ModalCore from '../ModalCore';
import { notify } from '../../Notify/Notify';
import FacebookLinkModal from './FacebookLink';

import apps1Jpg from '../../../image/apps-1.jpg';
import apps2Jpg from '../../../image/apps-2.jpg';
import apps3Jpg from '../../../image/apps-3.jpg';
import apps4Jpg from '../../../image/apps-4.jpg';
import apps5Jpg from '../../../image/apps-5.jpg';

const APP_TYPES = Object.freeze({
    LINE: 'LINE',
    FACEBOOK: 'FACEBOOK',
    WECHAT: 'WECHAT'
});

class AppInsertModal extends ModalCore {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        let groupId = Object.keys(this.props.groups)[0];
        this.state = {
            isOpen: this.props.isOpen,
            seletedGroupId: groupId || '',
            seletedAppType: APP_TYPES.LINE,

            fanPages: void 0,
            fanPagePics: void 0,

            appName: '',
            appId1: '',
            appSecret: '',
            appToken1: ''
        };

        this.insertApp = this.insertApp.bind(this);
        this.linkFacebookPages = this.linkFacebookPages.bind(this);
        this.seletedAppTypeChanged = this.seletedAppTypeChanged.bind(this);
        this.finishSelectFbPages = this.finishSelectFbPages.bind(this);
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (!this.state.seletedGroupId) {
            let groupId = Object.keys(props.groups)[0];
            this.setState({
                seletedGroupId: groupId ? props.groups[groupId] : ''
            });
        }
    }

    insertApp() {
        if (!this.state.appName) {
            return notify(this.props.t('Fill the bot name'), { type: 'warning' });
        } else if (!this.state.appId1) {
            if (APP_TYPES.LINE === this.state.seletedAppType) {
                return notify(this.props.t('Channel ID can\'t be empty'), { type: 'warning' });
            }
            return notify(this.props.t('App ID can\'t be empty'), { type: 'warning' });
        } else if (!this.state.appSecret) {
            if (APP_TYPES.LINE === this.state.seletedAppType) {
                return notify(this.props.t('Channel secret can\'t be empty'), { type: 'warning' });
            }
            return notify(this.props.t('App secret can\'t be empty'), { type: 'warning' });
        }

        let postApp = {
            type: this.state.seletedAppType,
            group_id: this.state.seletedGroupId,
            name: this.state.appName,
            id1: this.state.appId1,
            secret: this.state.appSecret
        };

        switch (postApp.type) {
            case APP_TYPES.LINE:
                if (!this.state.appToken1) {
                    return notify(this.props.t('Channel access token can\'t be empty'), { type: 'warning' });
                }
                postApp.token1 = this.state.appToken1;
                break;
            case APP_TYPES.FACEBOOK:
                return notify(this.props.t('An error occurred!'), { type: 'danger' });
            case APP_TYPES.WECHAT:
            default:
                break;
        }

        this.setState({ isProcessing: true });
        return apiDatabase.apps.insert(postApp).then(() => {
            this.setState({
                isOpen: false,
                isProcessing: false
            });
            return notify(this.props.t('Add successful!'), { type: 'success' });
        }).then(() => {
            return this.closeModal();
        }).catch(() => {
            this.setState({ isProcessing: false });
            return notify(this.props.t('Failed to add!'), { type: 'danger' });
        });
    }

    linkFacebookPages() {
        let groupId = this.state.seletedGroupId;
        return fbHlp.signInForPages().then((res) => {
            if (!res || (res && res.status !== 'connected')) {
                return;
            }

            return fbHlp.getFanPages().then((res) => {
                // 取得 fb 用戶的所有可管理的粉絲專頁後
                // 濾除已經加入的粉絲專頁
                let fanPages = res.data || [];
                fanPages = fanPages.filter((fanPage) => {
                    let canLink = true;
                    for (let appId in this.props.apps) {
                        let app = this.props.apps[appId];
                        if (!(APP_TYPES.FACEBOOK === app.type && app.group_id === groupId)) {
                            continue;
                        }

                        if (app.id1 === fanPage.id) {
                            canLink = false;
                            break;
                        }
                    }
                    return canLink;
                });

                if (0 === fanPages.length) {
                    return notify('沒有可進行連結的粉絲專頁', { type: 'warning' });
                }

                return Promise.all(fanPages.map((fanPage) => {
                    // 抓取粉絲專頁的大頭貼(用於選取時顯示)
                    return fbHlp.getFanPagesPicture(fanPage.id, fanPage.access_token);
                })).then((fanPagePics) => {
                    // 關閉此 modal 將粉絲專頁資料傳給另一個 modal
                    this.setState({
                        isOpen: false,
                        fanPages: fanPages,
                        fanPagePics: fanPagePics
                    });
                });
            });
        });
    }

    finishSelectFbPages(selectedFanPages) {
        if (0 === selectedFanPages.length) {
            return Promise.resolve();
        }

        // 使用者選取完欲連結的粉絲專頁後，將資料轉換為 Chatshier app 資料
        let appsList = selectedFanPages.map((fanPage) => {
            let app = {
                group_id: this.state.seletedGroupId,
                type: APP_TYPES.FACEBOOK,
                name: fanPage.name,
                id1: fanPage.id,
                token2: fanPage.access_token
            };
            return app;
        });

        // 未處理 bug: 使用 Promise.all 會造成 group 的 app_ids 只會新增一筆
        let responses = [];
        const nextRequest = (i) => {
            if (i >= appsList.length) {
                return Promise.resolve(responses);
            }

            let app = appsList[i];
            return apiDatabase.apps.insert(app).then(() => {
                return fbHlp.setFanPageSubscribeApp(app.id1, app.token2);
            }).then((res) => {
                responses.push(res);
                return nextRequest(i + 1);
            });
        };

        return nextRequest(0).then(() => {
            return notify('已成功連結了 ' + selectedFanPages.length + ' 個粉絲專頁', { type: 'success' });
        }).then((res) => {
            if (!res) {
                return;
            }
            return fbHlp.signOut();
        }).catch(() => {
            return notify('An error occurred!', { type: 'danger' });
        }).then(() => {
            return this.closeModal();
        });
    }

    seletedGroupIdChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.setState({ seletedGroupId: selectedOpt.value });
    }

    seletedAppTypeChanged(ev) {
        let selectedOpt = ev.target.selectedOptions[0];
        this.setState({ seletedAppType: selectedOpt.value });
    }

    renderFormContent() {
        switch (this.state.seletedAppType) {
            case APP_TYPES.LINE:
                return (
                    <Aux>
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">
                                <Trans i18nKey="Bot name" />:
                            </label>
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    name="appName"
                                    value={this.state.appName}
                                    placeholder={this.props.t('Fill the bot name')}
                                    onChange={(ev) => this.setState({ appName: ev.target.value })} />
                            </div>
                        </FormGroup>
                        <hr className="mt-5 mb-0" />
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Channel ID:</label>
                            <img className="img-fluid my-1" src={apps1Jpg} alt="" />
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    name="appId1"
                                    value={this.state.appId1}
                                    placeholder={this.props.t('Please go to LINE Developers')}
                                    onChange={(ev) => this.setState({ appId1: ev.target.value })} />
                            </div>
                        </FormGroup>
                        <hr className="mt-5 mb-0" />
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Channel Secret: </label>
                            <img className="img-fluid my-1" src={apps2Jpg} alt="" />
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    name="appSecret"
                                    value={this.state.appSecret}
                                    placeholder={this.props.t('Please go to LINE Developers')}
                                    onChange={(ev) => this.setState({ appSecret: ev.target.value })} />
                            </div>
                        </FormGroup>
                        <hr className="mt-5 mb-0" />
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Channel Access Token:</label>
                            <img className="img-fluid my-1" src={apps3Jpg} alt="" />
                            <div className="input-container">
                                <input className="form-control"
                                    type="text"
                                    name="appToken1"
                                    placeholder={this.props.t('Please go to LINE Developers')}
                                    value={this.state.appToken1}
                                    onChange={(ev) => this.setState({ appToken1: ev.target.value })} />
                            </div>
                        </FormGroup>
                        <hr className="mt-5 mb-0" />
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">Use webhooks:</label>
                            <img className="img-fluid my-1" src={apps4Jpg} alt="" />
                            <div className="pl-3 text-muted">
                                <Trans i18nKey="Please go to LINE Developers enable webhook" />
                            </div>
                        </FormGroup>
                        <hr className="mt-5 mb-0" />
                        <FormGroup>
                            <label className="col-form-label font-weight-bold">webhook URL:</label>
                            <img className="img-fluid my-1" src={apps5Jpg} alt="" />
                            <div className="pl-3 text-muted">
                                <Trans i18nKey="Please go to LINE Developers paste the webhook URL" />
                            </div>
                        </FormGroup>
                    </Aux>
                );
            case APP_TYPES.FACEBOOK:
                return (
                    <FormGroup className="fb-sdk-item">
                        <button type="button" className="px-4 py-2 text-center fb-import-button" onClick={this.linkFacebookPages}>
                            <i className="mr-1 fab fa-facebook-square fa-fw"></i>
                            <span><Trans i18nKey="Link pages with Facebook" /></span>
                        </button>
                    </FormGroup>
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <Aux>
                <Modal className="app-insert-modal" isOpen={this.state.isOpen} toggle={this.closeModal}>
                    <ModalHeader toggle={this.closeModal}>
                        <Trans i18nKey="Add bot" />
                    </ModalHeader>
                    <ModalBody>
                        <form className="app-form">
                            <FormGroup>
                                <label className="col-form-label font-weight-bold">
                                    <Trans i18nKey="Groups" />:
                                </label>
                                <select className="form-control" value={this.state.seletedGroupId} onChange={this.seletedGroupIdChanged}>
                                    {Object.keys(this.props.groups).map((groupId) => {
                                        let group = this.props.groups[groupId];
                                        return (
                                            <option key={groupId} value={groupId}>{group.name}</option>
                                        );
                                    })}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label className="col-form-label font-weight-bold">
                                    <Trans i18nKey="Platform of chat bot" />:
                                </label>
                                <select className="form-control" value={this.state.seletedAppType} onChange={this.seletedAppTypeChanged}>
                                    <option value={APP_TYPES.LINE}>LINE</option>
                                    <option value={APP_TYPES.FACEBOOK}>Facebook</option>
                                    {/* <option value={APP_TYPES.WECHAT}>WeChat</option> */}
                                </select>
                            </FormGroup>
                            <div className="app-items-container">
                                {this.renderFormContent()}
                            </div>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.seletedAppType !== APP_TYPES.FACEBOOK &&
                        <Button color="primary" onClick={this.insertApp} disabled={this.state.isProcessing}>
                            <Trans i18nKey="Add" />
                        </Button>}
                        <Button color="secondary" onClick={this.closeModal}>
                            <Trans i18nKey="Cancel" />
                        </Button>
                    </ModalFooter>
                </Modal>

                {!this.state.isOpen && this.state.fanPages && this.state.fanPagePics &&
                <FacebookLinkModal
                    isOpen={!this.state.isOpen}
                    fanPages={this.state.fanPages}
                    fanPagePics={this.state.fanPagePics}
                    close={this.finishSelectFbPages}>
                </FacebookLinkModal>}
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    return Object.assign({}, ownProps, {
        apps: storeState.apps,
        groups: storeState.groups
    });
};

export default withTranslate(connect(mapStateToProps)(AppInsertModal));
