import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import authHelper from '../../helpers/authentication';
import apiDatabase from '../../helpers/apiDatabase/index';

class AppsSelector extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        showAll: PropTypes.bool,
        apps: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        className: '',
        showAll: false
    };

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            selectedAppName: '',
            dropdownOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.selectedApp = this.selectedApp.bind(this);

        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);
        if (appIds.length > 0) {
            this.state.selectedAppName = apps[appIds[0]].name;
            this.props.onChange(appIds[0]);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && apiDatabase.apps.find(userId);
    }

    componentWillReceiveProps(props) {
        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);

        if (appIds.length > 0 && !this.state.selectedAppName) {
            this.selectedApp(appIds[0], apps[appIds[0]].name);
        }
    }

    toggle() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    selectedApp(appId, appName) {
        this.setState({
            selectedAppName: appName
        });
        this.props.onChange(appId);
    }

    renderApps() {
        let apps = this.props.apps || {};
        let appIds = Object.keys(apps);

        return appIds.map((appId) => {
            let app = apps[appId];
            if (!this.props.showAll && 'CHATSHIER' === app.type) {
                return null;
            }

            return (
                <DropdownItem key={appId}
                    onClick={() => this.selectedApp(appId, apps[appId].name)}>{apps[appId].name}
                </DropdownItem>
            );
        });
    }

    render() {
        return (
            <ButtonDropdown className={this.props.className} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="primary">
                    {this.state.selectedAppName || '選擇應用程序'}&nbsp;
                </DropdownToggle>
                <DropdownMenu>
                    {this.renderApps()}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps
    };
};

export default connect(mapStateToProps)(AppsSelector);
