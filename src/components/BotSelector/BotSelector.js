import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import authHelper from '../../helpers/authentication';
import { updateApps } from '../../redux/actions/apps';
import dbapi from '../../helpers/databaseApi/index';
class BotSelector extends React.Component {
    constructor(props) {
      super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;
            console.log(userId);

            return Promise.resolve().then(() => {
                if (Object.keys(this.props.apps).length > 0) {
                    return this.props.apps;
                }
                return dbapi.apps.findAll(userId);
            });
        }).then((resJson) => {
            let apps = resJson.data;
            console.log(apps);

            this.props.updateApps(apps);
        });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    renderApps() {
        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);
        return appIds.map((appId) => {
            let app = apps[appId];
            if ('CHATSHIER' !== app.type) {
                return <DropdownItem key={appId} onClick={() => this.props.onChange(appId)}>{apps[appId].name}</DropdownItem>;
            }
        });
    }

    render() {
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="primary">
                    選擇機器人&nbsp;
                </DropdownToggle>
                <DropdownMenu>
                    {this.renderApps()}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: state.apps
    };
};

const mapDispatchToProps = (dispatch) => {
    // 將此頁面有需要用到的 store 更新方法綁定至 props 中
    return {
        updateApps: bindActionCreators(updateApps, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BotSelector);