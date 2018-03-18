import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import authHelper from '../../helpers/authentication';
import { updateApps } from '../../redux/actions/apps';
import dbapi from '../../helpers/databaseApi/index';

class AppsSelector extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            dropdownOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        return authHelper.ready.then(() => {
            let userId = authHelper.userId;
            return userId && dbapi.apps.findAll(userId);
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
                return (
                    <DropdownItem key={appId}
                        onClick={() => this.props.onChange(appId)}>{apps[appId].name}
                    </DropdownItem>
                );
            }
            return null;
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

AppsSelector.propTypes = {
    apps: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

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

export default connect(mapStateToProps, mapDispatchToProps)(AppsSelector);
