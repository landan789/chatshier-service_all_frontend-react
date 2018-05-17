import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu,
    DropdownToggle } from 'reactstrap';
import { Trans } from 'react-i18next';
import { withTranslate } from '../../i18n';

import authHelper from '../../helpers/authentication';
import socketHelper from '../../helpers/socket';
import apiDatabase from '../../helpers/apiDatabase/index';
import apiBot from '../../helpers/apiBot/index';
import regex from '../../utils/regex';
import { fixHttpsResource, logos } from '../../utils/common';

import { notify } from '../../components/Notify/Notify';
import controlPanelStore from '../../redux/controlPanelStore';
import { selectChatroom } from '../../redux/actions/controlPanelStore/selectedChatroom';
import { findChatroomMessager, findMessagerSelf } from './Chat';

import defaultAvatarPng from '../../image/defautlt-avatar.png';
import './ProfilePanel.css';

const CHATSHIER = 'CHATSHIER';
const DEFAULT_CHATROOM_NAME = '群組聊天室';

const messagerCase = ['age', 'email', 'gender', 'phone', 'remark', 'custom_fields'];
const messagerSelfCase = ['createdTime', 'lastTime', 'chatCount'];

class ProfilePanel extends React.Component {
    static propTypes = {
        apps: PropTypes.object,
        appsChatrooms: PropTypes.object,
        appsFields: PropTypes.object,
        consumers: PropTypes.object,
        groups: PropTypes.object,
        users: PropTypes.object,
        appId: PropTypes.string.isRequired,
        chatroomId: PropTypes.string.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        /** @type {Chatshier.App} */
        this.app = void 0;
        /** @type {Chatshier.Chatroom} */
        this.chatroom = void 0;

        this.state = {
            multiSelectTexts: [],
            multiSelectOpenStates: {},
            fieldValues: {},
            chatroomNames: {}
        };
        this.appsAgents = {};
        this.createAppsAgents(this.props);

        this.onPhotoLoadError = this.onPhotoLoadError.bind(this);
        this.onChatroomNameChanged = this.onChatroomNameChanged.bind(this);
        this.updateChatroomName = this.updateChatroomName.bind(this);
        this.leavePlatformGroup = this.leavePlatformGroup.bind(this);
    }

    componentWillReceiveProps(props) {
        this.createAppsAgents(this.props);
    }

    componentWillUnmount() {
        this.app = this.chatroom = this.group = void 0;
    }

    createAppsAgents(props) {
        let apps = props.apps;
        let groups = props.groups;

        for (let appId in apps) {
            // 準備各個 app 的指派人清單
            // 由於每個 app 可能隸屬於不同的群組
            // 因此指派人清單必須根據 app 所屬的群組分別建立清單
            this.appsAgents[appId] = { agents: {} };
            for (let groupId in groups) {
                let group = groups[groupId];
                if (0 <= group.app_ids.indexOf(appId)) {
                    for (let memberId in group.members) {
                        let memberUserId = group.members[memberId].user_id;
                        this.appsAgents[appId].agents[memberUserId] = {
                            name: this.props.users[memberUserId].name,
                            email: this.props.users[memberUserId].email
                        };
                    }
                }
            }
        }
    }

    onPhotoLoadError(ev) {
        ev.target.src = defaultAvatarPng;
    }

    onChatroomNameChanged(ev) {
        let chatroomId = this.props.chatroomId;
        let chatroomNames = this.state.chatroomNames;
        chatroomNames[chatroomId] = ev.target.value;
        this.setState({ chatroomNames: chatroomNames });
    }

    onFieldValueChanged(ev, fieldId, opts) {
        let appId = this.props.appId;
        let field = this.props.appsFields[appId].fields[fieldId];
        let fieldValues = this.state.fieldValues;

        if (apiDatabase.appsFields.SETS_TYPES.MULTI_SELECT === field.setsType) {
            fieldValues[fieldId] = fieldValues[fieldId] || opts.initData.slice();
            fieldValues[fieldId][opts.idx] = !fieldValues[fieldId][opts.idx];

            let multiSelectTexts = this.state.multiSelectTexts;
            let textArray = fieldValues[fieldId].reduce((output, value, i) => {
                if (!value) {
                    return output;
                }
                output.push('assigned' === field.alias ? field.sets[i].agentName : field.sets[i]);
                return output;
            }, []);

            multiSelectTexts[fieldId] = textArray.join(',');
            if (textArray.length > 1) {
                multiSelectTexts[fieldId] = textArray[0] + ' 及其他 ' + (textArray.length - 1) + ' 項';
            }

            this.setState({
                fieldValues: fieldValues,
                multiSelectTexts: multiSelectTexts
            });
        } else {
            fieldValues[fieldId] = ev.target.value;
            this.setState({ fieldValues: fieldValues });
        }
    }

    toggleMultiSelect(ev, fieldId) {
        let multiSelectOpenStates = this.state.multiSelectOpenStates;
        multiSelectOpenStates[fieldId] = !multiSelectOpenStates[fieldId];
        this.setState({ multiSelectOpenStates: multiSelectOpenStates });
    }

    updateProfile(ev, platformUid) {
        let fields = this.props.appsFields[this.props.appId].fields;
        let putField = {};

        for (let fieldId in fields) {
            /** @type {Chatshier.Field} */
            let field = fields[fieldId];
            if (undefined === this.state.fieldValues[fieldId]) {
                continue;
            }

            if (field.type === apiDatabase.appsFields.TYPES.CUSTOM) {
                putField.custom_fields = putField.custom_fields || {};
                putField.custom_fields[fieldId] = putField.custom_fields[fieldId] || {};

                if (field.setsType === apiDatabase.appsFields.SETS_TYPES.MULTI_SELECT) {
                    putField.custom_fields[fieldId].value = this.state.fieldValues[fieldId].reduce((output, value, i) => {
                        if (!value) {
                            return output;
                        }
                        output.push(field.sets[i]);
                        return output;
                    }, []);
                    return;
                }

                putField.custom_fields[fieldId].value = this.state.fieldValues[fieldId];
                if (field.setsType === apiDatabase.appsFields.SETS_TYPES.NUMBER) {
                    putField.custom_fields[fieldId].value = parseInt(putField.custom_fields[fieldId], 10);
                } else if (field.setsType === apiDatabase.appsFields.SETS_TYPES.DATE) {
                    putField.custom_fields[fieldId].value = new Date(putField.custom_fields[fieldId]).getTime();
                }
            } else {
                let alias = field.alias;
                if ('assigned' === alias) {
                    alias = 'assigned_ids';
                    let agents = this.appsAgents[this.props.appId].agents;
                    let agentUserIds = Object.keys(agents);
                    putField[alias] = this.state.fieldValues[fieldId].reduce((output, value, i) => {
                        if (!value) {
                            return output;
                        }
                        output.push(agentUserIds[i]);
                        return output;
                    }, []);
                    return;
                }

                putField[alias] = this.state.fieldValues[fieldId];
                if (field.setsType === apiDatabase.appsFields.SETS_TYPES.NUMBER) {
                    putField[alias] = parseInt(putField[alias], 10);
                } else if (field.setsType === apiDatabase.appsFields.SETS_TYPES.DATE) {
                    putField[alias] = new Date(putField[alias]).getTime();
                }
            }
        }

        if ('number' === typeof putField.age && !(putField.age >= 0 && putField.age <= 150)) {
            return notify('年齡限制 0 ~ 150 歲', { type: 'warning' });
        } else if (putField.email && !regex.emailStrict.test(putField.email)) {
            return notify('電子郵件不符合格式', { type: 'warning' });
        } else if (putField.phone && !regex.phone.test(putField.phone)) {
            return notify('電話號碼不符合格式, ex: 0912XXXXXX', { type: 'warning' });
        }

        if (0 === Object.keys(putField).length) {
            return;
        }

        if (!window.confirm('確定要更新對象用戶的個人資料嗎？')) {
            return;
        }

        let socketBody = {
            params: {
                userid: authHelper.userId,
                appid: this.props.appId,
                chatroomid: this.props.chatroomId,
                platformuid: platformUid
            },
            body: putField
        };

        return socketHelper.updateMessagerToServer(socketBody).then(() => {
            return notify('用戶資料更新成功', { type: 'success' });
        }).catch(() => {
            return notify('用戶資料更新失敗', { type: 'danger' });
        });
    }

    updateChatroomName(ev) {
        let appId = this.props.appId;
        let chatroomId = this.props.chatroomId;
        let userId = authHelper.userId;
        let putChatroom = {
            name: this.state.chatroomNames[chatroomId]
        };

        return Promise.resolve().then(() => {
            let oldName = this.props.appsChatrooms[appId].chatrooms[chatroomId].name;
            if (!putChatroom.name || putChatroom.name === oldName) {
                return;
            }
            return apiDatabase.appsChatrooms.update(appId, chatroomId, putChatroom, userId).then(() => {
                return notify('更新成功', { type: 'success' });
            });
        }).catch(() => {
            return notify('更新失敗', { type: 'danger' });
        });
    }

    leavePlatformGroup(ev) {
        if (!window.confirm('確定要離開嗎？此聊天室將會刪除但資料將會保留。')) {
            return;
        }

        let appId = this.props.appId;
        let chatroomId = this.props.chatroomId;
        let userId = authHelper.userId;

        return apiBot.chatrooms.leaveGroupRoom(appId, chatroomId, userId).then((resJson) => {
            controlPanelStore.dispatch(selectChatroom('', ''));
            return notify('已成功離開群組', { type: 'success' });
        }).catch(() => {
            return notify('執行失敗', { type: 'danger' });
        });
    }

    renderChatroomProfile() {
        let chatroomId = this.props.chatroomId;
        let groupId = this.app.group_id;
        /** @type {Chatshier.Group} */
        let group = this.props.groups[groupId];
        if (!group) {
            return null;
        }
        let isChatshierApp = CHATSHIER === this.app.type;

        return (
            <table className="table table-hover panel-table">
                <tbody>
                    <tr>
                        <th className="profile-label">群組名稱</th>
                        <td className="d-flex profile-content">
                            <input className="form-control td-inner chatroom-name"
                                type="text"
                                value={this.state.chatroomNames[chatroomId] || this.chatroom.name}
                                placeholder={DEFAULT_CHATROOM_NAME}
                                onChange={(ev) => this.onChatroomNameChanged(ev, chatroomId)} />
                            <button className="ml-2 btn btn-primary btn-update-chatroom" onClick={this.updateChatroomName}>
                                <span>更新</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th className="py-3 profile-label align-top">{isChatshierApp ? '群組成員' : '客戶成員'}</th>
                        <td className="profile-content">
                            {(() => {
                                let elems = [];
                                if (isChatshierApp) {
                                    for (let memberId in group.members) {
                                        let memberUserId = group.members[memberId].user_id;
                                        let memberUser = this.props.users[memberUserId];
                                        memberUser && elems.push(
                                            <div className="person-chip">
                                                <img className="person-avatar" src={fixHttpsResource(memberUser.photo || defaultAvatarPng)} alt="" />
                                                <span>{memberUser.name}</span>
                                            </div>
                                        );
                                    }
                                } else {
                                    let messagers = this.chatroom.messagers;
                                    for (let messagerId in messagers) {
                                        let messager = messagers[messagerId];
                                        if (CHATSHIER === messager.type) {
                                            continue;
                                        }
                                        /** @type {Chatshier.Consumer} */
                                        let consumer = this.props.consumers[messager.platformUid];
                                        consumer && elems.push(
                                            <div key={messagerId} className="person-chip">
                                                <img className="person-avatar" src={fixHttpsResource(consumer.photo || defaultAvatarPng)} alt="" onError={this.onPhotoLoadError} />
                                                <span>{consumer.name}</span>
                                            </div>
                                        );
                                    }
                                }
                                return elems;
                            })()}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderPersonProfile(platformUid, person) {
        let appId = this.props.appId;
        let messager = findChatroomMessager(this.chatroom.messagers, this.app.type);
        let messagerSelf = findMessagerSelf(this.chatroom.messagers);
        let customFields = messager.custom_fields || {};

        // 呈現客戶分類條件資料之前先把客戶分類條件資料設定的順序排列
        let appsFields = this.props.appsFields;
        let fieldIds = Object.keys(appsFields[appId].fields);
        fieldIds.sort((a, b) => {
            return appsFields[appId].fields[a].order - appsFields[appId].fields[b].order;
        });

        let renderField = (fieldId, field) => {
            let timezoneGap = new Date().getTimezoneOffset() * 60 * 1000;
            let readonly = 'name' !== field.alias && field.type === apiDatabase.appsFields.TYPES.SYSTEM;
            let fieldValue = '';

            if (field.type === apiDatabase.appsFields.TYPES.CUSTOM) {
                fieldValue = customFields[fieldId] ? customFields[fieldId].value : '';
            } else {
                if (messagerCase.indexOf(field.alias) >= 0) {
                    fieldValue = undefined !== messager[field.alias] ? messager[field.alias] : '';
                } else if (messagerSelfCase.indexOf(field.alias) >= 0) {
                    fieldValue = undefined !== messagerSelf[field.alias] ? messagerSelf[field.alias] : '';
                } else {
                    // 如果是名稱的話則是取用 displayName
                    if ('name' === field.alias) {
                        fieldValue = (messagerSelf.namings && messagerSelf.namings[platformUid]) || '';
                    } else {
                        fieldValue = undefined !== person[field.alias] ? person[field.alias] : '';
                    }
                }
            }

            let SETS_TYPES = apiDatabase.appsFields.SETS_TYPES;
            switch (field.setsType) {
                case SETS_TYPES.SELECT:
                    return (
                        <td className="profile-content user-info-td">
                            <select className="form-control td-inner"
                                value={undefined !== this.state.fieldValues[fieldId] ? this.state.fieldValues[fieldId] : fieldValue}
                                onChange={(ev) => this.onFieldValueChanged(ev, fieldId)}>
                                <option value="">未選擇</option>
                                {field.sets.map((set, i) => (
                                    <option key={i} value={set}>
                                        <Trans i18nKey={set} />
                                    </option>
                                ))}
                            </select>
                        </td>
                    );
                case SETS_TYPES.MULTI_SELECT:
                    let selectValues = [];
                    if ('assigned' === field.alias) {
                        // 指派人存放的位置在每個 chatroom 的 messager 裡
                        // 取得 chatroom messager 的 assigned_ids 來確認有指派給 chatshier 那些 users
                        let agents = this.appsAgents[appId].agents;
                        let assignedIds = messager.assigned_ids;
                        field.sets = [];

                        for (let agentUserId in agents) {
                            field.sets.push({
                                agentUserId: agentUserId,
                                agentName: agents[agentUserId].name
                            });
                            selectValues.push(0 <= assignedIds.indexOf(agentUserId));
                        }
                    } else {
                        for (let i in field.sets) {
                            selectValues[i] = 0 <= fieldValue.indexOf(field.sets[i]);
                        }
                    }
                    let multiSelectText = selectValues.reduce((output, value, i) => {
                        if (!value) {
                            return output;
                        }
                        output.push('assigned' === field.alias ? field.sets[i].agentName : field.sets[i]);
                        return output;
                    }, []).join(',');

                    return (
                        <td className="user-info-td">
                            <Dropdown className="btn-group btn-block td-inner multi-select-wrapper"
                                toggle={(ev) => this.toggleMultiSelect(ev, fieldId)}
                                isOpen={this.state.multiSelectOpenStates[fieldId]}>
                                <DropdownToggle color="none" className="btn btn-light btn-border btn-block">
                                    <span className="multi-select-values">{undefined !== this.state.multiSelectTexts[fieldId] ? this.state.multiSelectTexts[fieldId] : multiSelectText}</span>
                                    <i className="pl-1 fas fa-caret-down"></i>
                                </DropdownToggle>
                                <DropdownMenu className="multi-select-container">
                                    {field.sets.map((set, i) => {
                                        let setsValue = set;
                                        let labelName = set;

                                        if ('assigned' === field.alias) {
                                            setsValue = set.agentUserId;
                                            labelName = set.agentName;
                                        }

                                        return (
                                            <DropdownItem key={i}>
                                                <div className="form-check form-check-inline">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input"
                                                            type="checkbox"
                                                            value={setsValue}
                                                            checked={this.state.fieldValues[fieldId] ? this.state.fieldValues[fieldId][i] : !!selectValues[i]}
                                                            onChange={(ev) => this.onFieldValueChanged(ev, fieldId, { idx: i, initData: selectValues })} />
                                                        {labelName}
                                                    </label>
                                                </div>
                                            </DropdownItem>
                                        );
                                    })}
                                </DropdownMenu>
                            </Dropdown>
                        </td>
                    );
                case SETS_TYPES.CHECKBOX:
                    return (
                        <td className="user-info-td">
                            <input className="td-inner"
                                type="checkbox"
                                checked={!!fieldValue}
                                readOnly={readonly}
                                disabled={readonly}
                                onChange={(ev) => this.onFieldValueChanged(ev, fieldId)} />
                        </td>
                    );
                case SETS_TYPES.DATE:
                    fieldValue = fieldValue || 0;
                    let fieldDateStr = new Date(new Date(fieldValue).getTime() - timezoneGap).toJSON().split('.').shift();
                    return (
                        <td className="user-info-td">
                            <input className="form-control td-inner"
                                type="datetime-local"
                                value={fieldDateStr}
                                readOnly={readonly}
                                disabled={readonly}
                                onChange={(ev) => this.onFieldValueChanged(ev, fieldId)} />
                        </td>
                    );
                case SETS_TYPES.TEXT:
                case SETS_TYPES.NUMBER:
                default:
                    let placeholder = 'name' === field.alias ? person.name : '尚未輸入';
                    let inputType = SETS_TYPES.NUMBER === field.setsType ? 'tel' : 'text';
                    inputType = 'email' === field.alias ? 'email' : inputType;
                    return (
                        <td className="user-info-td">
                            <input className="form-control td-inner"
                                type={inputType}
                                placeholder={placeholder}
                                value={undefined !== this.state.fieldValues[fieldId] ? this.state.fieldValues[fieldId] : fieldValue || ''}
                                readOnly={readonly}
                                disabled={readonly}
                                autoCapitalize="none"
                                onChange={(ev) => this.onFieldValueChanged(ev, fieldId)} />
                        </td>
                    );
            }
        };

        return (
            <table className="table table-hover panel-table">
                <tbody>
                    {fieldIds.map((fieldId) => {
                        let field = appsFields[appId].fields[fieldId];
                        return (
                            <tr key={fieldId}>
                                <th className="profile-label user-info-th">
                                    <Trans i18nKey={field.text} />
                                </th>
                                {renderField(fieldId, field)}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    render() {
        let appId = this.props.appId;
        let chatroomId = this.props.chatroomId;

        this.app = this.props.apps[appId];
        if (!this.app) {
            return null;
        }

        this.chatroom = this.props.appsChatrooms[appId].chatrooms[chatroomId];
        if (!this.chatroom) {
            return null;
        }

        let isGroupChatroom = CHATSHIER === this.app.type || !!this.chatroom.platformGroupId;
        let platformUid;
        let person;

        if (isGroupChatroom) {
            let userId = authHelper.userId;
            platformUid = userId;
            person = Object.assign({}, this.props.users[userId]);
            person.photo = logos[this.app.type];
        } else {
            let platformMessager = findChatroomMessager(this.chatroom.messagers, this.app.type);
            platformUid = platformMessager.platformUid;
            person = this.props.consumers[platformUid];
            person && (person.photo = person.photo || defaultAvatarPng);
        }

        if (!person) {
            return null;
        }

        return (
            <div className="px-0 profile-panel col animated slideInRight">
                <div className="px-2 py-3 profile-wrapper">
                    <div className="person-profile profile-content table-responsive profile-group animated fadeIn">
                        <div className="photo-container">
                            <img className="consumer-avatar larger" src={fixHttpsResource(person.photo)} alt="無法顯示相片" />
                        </div>
                        {(() => {
                            if (isGroupChatroom) {
                                return (
                                    <Aux>
                                        {this.renderChatroomProfile()}
                                        <div className="p-2 leave-group-room text-right">
                                            <button type="button" className="btn btn-danger" onClick={this.leavePlatformGroup}>
                                                <i className="fas fa-sign-out-alt fa-fw"></i>
                                                <span>離開群組</span>
                                            </button>
                                        </div>
                                    </Aux>
                                );
                            }

                            return (
                                <Aux>
                                    {this.renderPersonProfile(platformUid, person)}
                                    <div className="profile-confirm text-center">
                                        <button className="btn btn-info" type="button" onClick={(ev) => this.updateProfile(ev, platformUid)}>確認</button>
                                    </div>
                                </Aux>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms,
        appsFields: storeState.appsFields,
        consumers: storeState.consumers,
        groups: storeState.groups,
        users: storeState.users
    };
};

export default connect(mapStateToProps)(withTranslate(ProfilePanel));
