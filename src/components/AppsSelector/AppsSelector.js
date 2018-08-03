import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from '../../i18n';

import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import apiDatabase from '../../helpers/apiDatabase/index';

const ICONS = {
    [apiDatabase.apps.TYPES.LINE]: 'mr-1 fab fa-line fa-fw line-color',
    [apiDatabase.apps.TYPES.FACEBOOK]: 'mr-1 fab fa-facebook-messenger fa-fw fb-messsenger-color'
};

class AppsSelector extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
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
            let recentAppId = window.localStorage.getItem('recentAppId');
            let appId = recentAppId && appIds.indexOf(recentAppId) >= 0 ? recentAppId : appIds[0];
            this.state.selectedAppName = apps[appId].name;
            this.props.onChange(appId);
        }
    }

    componentDidMount() {
        return apiDatabase.apps.find().then(() => {
            let props = this.props;
            let apps = props.apps || {};

            let appIds = Object.keys(apps).filter((appId) => {
                return this.props.showAll || (!this.props.showAll && apiDatabase.apps.TYPES.CHATSHIER !== apps[appId].type);
            });

            if (appIds.length > 0 && !this.state.selectedAppName) {
                let recentAppId = window.localStorage.getItem('recentAppId');
                let appId = recentAppId && appIds.indexOf(recentAppId) >= 0 ? recentAppId : appIds[0];
                this.selectedApp(appId, apps[appId].name);
            }
        });
    }

    toggle() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    selectedApp(appId, appName) {
        window.localStorage.setItem('recentAppId', appId);
        this.setState({ selectedAppName: appName });
        this.props.onChange(appId);
    }

    render() {
        return (
            <ButtonDropdown className={this.props.className} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="primary">
                    {this.state.selectedAppName || this.props.t('Select a bot')}
                </DropdownToggle>
                <DropdownMenu>
                    {Object.keys(this.props.apps).map((appId) => {
                        let app = this.props.apps[appId];
                        if (!this.props.showAll && apiDatabase.apps.TYPES.CHATSHIER === app.type) {
                            return null;
                        }

                        return (
                            <DropdownItem key={appId} className="px-3"
                                onClick={() => this.selectedApp(appId, this.props.apps[appId].name)}>
                                <i className={ICONS[app.type]}></i>
                                {this.props.apps[appId].name}
                            </DropdownItem>
                        );
                    })}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return Object.assign({}, ownProps, {
        apps: storeState.apps
    });
};

export default withTranslate(connect(mapStateToProps)(AppsSelector));
