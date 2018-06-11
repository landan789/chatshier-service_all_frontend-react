import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card, CardBody, Row, Container, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../i18n';

import ROUTES from '../../config/route';
import authHelper from '../../helpers/authentication';
import browserHelper from '../../helpers/browser';
import apiDatabase from '../../helpers/apiDatabase/index';
import { formatDate, formatTime } from '../../utils/unitTime';

import ControlPanel from '../../components/Navigation/ControlPanel/ControlPanel';
import PageWrapper from '../../components/Navigation/PageWrapper/PageWrapper';
import AppsSelector from '../../components/AppsSelector/AppsSelector';
import AnalysisChart from './AnalysisChart';
import WordCloudChart from './WordCloudChart';

import './Analysis.css';

export const ANALYSIS_TYPES = Object.freeze({
    0: 'NONE',
    1: 'MONTH',
    2: 'DAY',
    3: 'HOUR',
    4: 'TIME',
    5: 'WORDCLOUR',
    NONE: 0,
    MONTH: 1,
    DAY: 2,
    HOUR: 3,
    TIME: 4,
    WORDCLOUR: 5
});

class Analysis extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        apps: PropTypes.object.isRequired,
        appsChatrooms: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            selectedAppId: '',
            selectedType: ANALYSIS_TYPES.NONE,
            selectedTypeName: '',
            startDatetime: null,
            endDatetime: null
        };

        this.onAppChanged = this.onAppChanged.bind(this);
        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onStartDatetimeChanged = this.onStartDatetimeChanged.bind(this);
        this.onEndDatetimeChanged = this.onEndDatetimeChanged.bind(this);
        this.toggleTypeDropdown = this.toggleTypeDropdown.bind(this);

        browserHelper.setTitle(this.props.t('Analysis'));

        if (!authHelper.hasSignedin()) {
            authHelper.signOut();
            this.props.history.replace(ROUTES.SIGNIN);
        }
    }

    componentDidMount() {
        let userId = authHelper.userId;
        return userId && apiDatabase.appsChatrooms.find(userId);
    }

    UNSAFE_componentWillReceiveProps(props) {
        let appChatrooms = props.appsChatrooms[this.state.selectedAppId];
        if (appChatrooms) {
            let startDatetime = Date.now();
            let endDatetime = Date.now();

            for (let chatroomId in appChatrooms.chatrooms) {
                let chatroom = appChatrooms.chatrooms[chatroomId];
                let messages = chatroom.messages;

                for (let messageId in messages) {
                    let message = messages[messageId];
                    let messageTime = new Date(message.time).getTime();
                    if (messageTime < startDatetime) {
                        startDatetime = messageTime;
                    }

                    if (messageTime > endDatetime) {
                        endDatetime = messageTime;
                    }
                }
            }

            this.setState({
                startDatetime: startDatetime,
                endDatetime: endDatetime
            });
        }
    }

    onAppChanged(appId) {
        let newState = {
            selectedAppId: appId
        };

        let appChatrooms = this.props.appsChatrooms[appId];
        if (appChatrooms) {
            newState.startDatetime = newState.endDatetime = Date.now();

            for (let chatroomId in appChatrooms.chatrooms) {
                let chatroom = appChatrooms.chatrooms[chatroomId];
                let messages = chatroom.messages;

                for (let messageId in messages) {
                    let message = messages[messageId];
                    let messageTime = new Date(message.time).getTime();
                    if (messageTime < newState.startDatetime) {
                        newState.startDatetime = messageTime;
                    }

                    if (messageTime > newState.endDatetime) {
                        newState.endDatetime = messageTime;
                    }
                }
            }
        }

        this.setState(newState);
    }

    onTypeChanged(ev, type) {
        let typeName = ev.target.textContent;
        this.setState({
            selectedType: type,
            selectedTypeName: typeName
        });
    }

    onStartDatetimeChanged(date) {
        let datetime = date.getTime();
        this.setState({
            startDatetime: datetime <= this.state.endDatetime ? datetime : this.state.endDatetime
        });
    }

    onEndDatetimeChanged(date) {
        let datetime = date.getTime();
        this.setState({
            endDatetime: datetime >= this.state.startDatetime ? datetime : this.state.startDatetime
        });
    }

    toggleTypeDropdown() {
        this.setState({ typeDropdownOpen: !this.state.typeDropdownOpen });
    }

    render() {
        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Analysis')}>
                    <Fade in className="analysis-wrapper">
                        <Container className="mt-5 analysis-container">
                            <Card className="mb-5 chsr analyze-body">
                                <h3 className="page-title">
                                    <Trans i18nKey="Message analysis" />
                                </h3>

                                <CardBody>
                                    <Row>
                                        <AppsSelector className="col-12 col-lg-6 mb-3" onChange={this.onAppChanged} />
                                        <Dropdown className="col-12 col-lg-6 mb-3 chart-dropdown" isOpen={this.state.typeDropdownOpen} toggle={this.toggleTypeDropdown}>
                                            <DropdownToggle className="btn btn-info" caret color="info">
                                                {this.state.selectedTypeName || this.props.t('Select a data type')}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className="view-time" onClick={(ev) => this.onTypeChanged(ev, ANALYSIS_TYPES.TIME)}>
                                                    <Trans i18nKey="Total count of messages per hour" />
                                                </DropdownItem>
                                                <DropdownItem className="view-month" onClick={(ev) => this.onTypeChanged(ev, ANALYSIS_TYPES.MONTH)}>
                                                    <Trans i18nKey="Unit" />: <Trans i18nKey="Month" />
                                                </DropdownItem>
                                                <DropdownItem className="view-date" onClick={(ev) => this.onTypeChanged(ev, ANALYSIS_TYPES.DAY)}>
                                                    <Trans i18nKey="Unit" />: <Trans i18nKey="Day" />
                                                </DropdownItem>
                                                <DropdownItem className="view-hour" onClick={(ev) => this.onTypeChanged(ev, ANALYSIS_TYPES.HOUR)}>
                                                    <Trans i18nKey="Unit" />: <Trans i18nKey="Hour" />
                                                </DropdownItem>
                                                <DropdownItem className="view-cloud" onClick={(ev) => this.onTypeChanged(ev, ANALYSIS_TYPES.WORDCLOUR)}>
                                                    <Trans i18nKey="Frequency of word" />
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>

                                        <div className="w-100 mt-3 mb-4 px-3 flex-nowrap justify-content-between date-wrapper">
                                            <DateTimePicker className="px-0 mb-2 col-12 col-lg-6"
                                                culture={currentLanguage}
                                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                                timeFormat={(time) => formatTime(time, false)}
                                                value={new Date(this.state.startDatetime)}
                                                onChange={this.onStartDatetimeChanged}>
                                            </DateTimePicker>
                                            <DateTimePicker className="px-0 mb-2 col-12 col-lg-6"
                                                culture={currentLanguage}
                                                format={(datetime) => formatDate(datetime) + ' ' + formatTime(datetime, false)}
                                                timeFormat={(time) => formatTime(time, false)}
                                                value={new Date(this.state.endDatetime)}
                                                onChange={this.onEndDatetimeChanged}>
                                            </DateTimePicker>
                                        </div>
                                    </Row>

                                    <div className="chart-container">
                                        {!!this.state.selectedAppId &&
                                        this.state.selectedType !== ANALYSIS_TYPES.NONE &&
                                        this.state.selectedType !== ANALYSIS_TYPES.WORDCLOUR &&
                                        <AnalysisChart className="w-100 h-100 mx-auto chart-body"
                                            dataType={this.state.selectedType}
                                            appId={this.state.selectedAppId}
                                            appsChatrooms={this.props.appsChatrooms}
                                            startDatetime={this.state.startDatetime}
                                            endDatetime={this.state.endDatetime} />}

                                        {!!this.state.selectedAppId &&
                                        this.state.selectedType === ANALYSIS_TYPES.WORDCLOUR &&
                                        <WordCloudChart className="w-100 h-100 mx-auto chart-body"
                                            appId={this.state.selectedAppId}
                                            appsChatrooms={this.props.appsChatrooms}
                                            startDatetime={this.state.startDatetime}
                                            endDatetime={this.state.endDatetime} />}
                                    </div>
                                </CardBody>
                            </Card>
                        </Container>
                    </Fade>
                </PageWrapper>
            </Aux>
        );
    }
}

const mapStateToProps = (storeState, ownProps) => {
    // 將此頁面需要使用的 store state 抓出，綁定至 props 中
    return {
        apps: storeState.apps,
        appsChatrooms: storeState.appsChatrooms
    };
};

export default withRouter(withTranslate(connect(mapStateToProps)(Analysis)));
