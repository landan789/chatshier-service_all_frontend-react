import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import { connect } from 'react-redux';

import authHelper from '../../helpers/authentication';
import apiDatabase from '../../helpers/apiDatabase/index';
import { fixHttpsResource, logos } from '../../utils/common';
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
            chatroomNames: {}
        };
        this.appsAgents = {};
        this.createAppsAgents(this.props);

        this.onPhotoLoadError = this.onPhotoLoadError.bind(this);
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

    onChatroomChanged(ev, chatroomId) {
        let chatroomNames = this.state.chatroomNames;
        chatroomNames[chatroomId] = ev.target.value;
        this.setState({ chatroomNames: chatroomNames });
    }

    renderChatroomProfile(appId, chatroomId) {
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
                                onChange={(ev) => this.onChatroomChanged(ev, chatroomId)} />
                            <button className="ml-2 btn btn-primary btn-update-chatroom">更新</button>
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
                                                <img className="person-avatar" src={fixHttpsResource(memberUser.photo || 'image/avatar-default.png')} alt="" />
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
                                                <img className="person-avatar" src={fixHttpsResource(consumer.photo || 'image/avatar-default.png')} alt="" onError={this.onPhotoLoadError} />
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

            // 在 html append 到 dom 上後，抓取資料找到指派人的欄位把資料填入
            if ('assigned' === field.alias) {
                // 指派人存放的位置在每個 chatroom 的 messager 裡
                // 取得 chatroom messager 的 assigned_ids 來確認有指派給 chatshier 那些 users
                let agents = this.appsAgents[appId].agents;
                let assignedIds = messager.assigned_ids;
                field.sets = [];
                fieldValue = [];

                for (let agentUserId in agents) {
                    field.sets.push({
                        agentUserId: agentUserId,
                        agentName: agents[agentUserId].name
                    });
                    fieldValue.push(0 <= assignedIds.indexOf(agentUserId));
                }
            }

            let SETS_TYPES = apiDatabase.appsFields.SETS_TYPES;
            switch (field.setsType) {
                case SETS_TYPES.SELECT:
                    return (
                        <td className="profile-content user-info-td">
                            <select className="form-control td-inner" value={fieldValue}>
                                <option value="">未選擇</option>
                                {field.sets.map((set, i) => (
                                    <option key={i} value={set}>{set}</option>
                                ))}
                            </select>
                        </td>
                    );
                case SETS_TYPES.MULTI_SELECT:
                    let selectValues = fieldValue instanceof Array ? fieldValue : [];
                    let multiSelectText = selectValues.reduce((output, value, i) => {
                        if (!value) {
                            return output;
                        }

                        output.push('assigned' === field.alias ? field.sets[i].agentName : field.sets[i]);
                        return output;
                    }, []).join(',');

                    return (
                        <td className="user-info-td">
                            <div className="btn-group btn-block td-inner multi-select-wrapper">
                                <button className="btn btn-light btn-border btn-block dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <span className="multi-select-values">{multiSelectText}</span>
                                    <span className="caret"></span>
                                </button>
                                <div className="multi-select-container dropdown-menu">
                                    {field.sets.map((set, i) => {
                                        if ('assigned' === field.alias) {
                                            return (
                                                <div key={i} className="dropdown-item">
                                                    <div className="form-check form-check-inline">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input"
                                                                type="checkbox"
                                                                value={set.agentUserId}
                                                                checked={!!selectValues[i]}
                                                                onChange={() => {}} />
                                                            {set.agentName}
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={i} className="dropdown-item">
                                                <div className="form-check form-check-inline">
                                                    <label className="form-check-label">
                                                        <input type="checkbox" className="form-check-input" value={set} checked={!!selectValues[i]} />
                                                        {set}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </td>
                    );
                case SETS_TYPES.CHECKBOX:
                    return (
                        <td className="user-info-td">
                            <input className="td-inner"
                                type="checkbox"
                                checked={!!fieldValue}
                                readOnly={readonly}
                                disabled={readonly} />
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
                                disabled={readonly} />
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
                                value={fieldValue}
                                readOnly={readonly}
                                disabled={readonly}
                                autoCapitalize="none" />
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
                                <th className="profile-label user-info-th">{field.text}</th>
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
            <div className="profile-panel col px-0 animated slideInRight">
                <div className="profile-wrapper p-2">
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
                                            <button type="button" className="btn btn-danger">
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
                                        <button type="button" className="btn btn-info">確認</button>
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

export default connect(mapStateToProps)(ProfilePanel);
