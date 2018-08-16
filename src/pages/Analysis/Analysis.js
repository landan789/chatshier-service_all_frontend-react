import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from 'react-aux';
import { Fade, Card, CardBody, Row, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem } from 'reactstrap';
import { DateTimePicker } from 'react-widgets';
import { Trans } from 'react-i18next';
import { withTranslate, currentLanguage } from '../../i18n';

import ROUTES from '../../config/route';
import authHlp from '../../helpers/authentication';
import browserHlp from '../../helpers/browser';
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevProps === nextProps) {
            return prevState;
        }
        let nextState = prevState;
        nextState.prevProps = nextProps;

        let appChatrooms = nextProps.appsChatrooms[prevState.selectedAppId];
        if (!appChatrooms) {
            return nextState;
        }

        nextState.startDatetime = nextState.endDatetime = Date.now();
        for (let chatroomId in appChatrooms.chatrooms) {
            let chatroom = appChatrooms.chatrooms[chatroomId];
            let messages = chatroom.messages;

            for (let messageId in messages) {
                let message = messages[messageId];
                let messageTime = new Date(message.time).getTime();
                if (messageTime < nextState.startDatetime) {
                    nextState.startDatetime = messageTime;
                }

                if (messageTime > nextState.endDatetime) {
                    nextState.endDatetime = messageTime;
                }
            }
        }
        return nextState;
    }

    constructor(props, ctx) {
        super(props, ctx);

        browserHlp.setTitle(props.t('Analysis'));
        if (!authHlp.hasSignedin()) {
            return props.history.replace(ROUTES.SIGNOUT);
        }

        this.dataTypes = [{
            className: 'view-time',
            type: ANALYSIS_TYPES.TIME,
            text: this.props.t('Total count of messages per hour')
        }, {
            className: 'view-month',
            type: ANALYSIS_TYPES.MONTH,
            text: this.props.t('Unit') + ': ' + this.props.t('Month')
        }, {
            className: 'view-date',
            type: ANALYSIS_TYPES.DAY,
            text: this.props.t('Unit') + ': ' + this.props.t('Day')
        }, {
            className: 'view-hour',
            type: ANALYSIS_TYPES.HOUR,
            text: this.props.t('Unit') + ': ' + this.props.t('Hour')
        }, {
            className: 'view-cloud',
            type: ANALYSIS_TYPES.WORDCLOUR,
            text: this.props.t('Frequency of word')
        }];

        this.onAppChanged = this.onAppChanged.bind(this);
        this.onStartDatetimeChanged = this.onStartDatetimeChanged.bind(this);
        this.onEndDatetimeChanged = this.onEndDatetimeChanged.bind(this);
        this.toggleTypeDropdown = this.toggleTypeDropdown.bind(this);

        this.state = Object.assign({
            prevProps: null,
            selectedAppId: '',
            selectedDataType: this.dataTypes[0],
            startDatetime: 0,
            endDatetime: Date.now()
        }, Analysis.getDerivedStateFromProps(props, {}));
    }

    componentDidMount() {
        return apiDatabase.appsChatrooms.find();
    }

    onAppChanged(appId) {
        let nextState = {
            selectedAppId: appId
        };

        let appChatrooms = this.props.appsChatrooms[appId];
        if (!appChatrooms) {
            return;
        }

        nextState.startDatetime = nextState.endDatetime = Date.now();
        for (let chatroomId in appChatrooms.chatrooms) {
            let chatroom = appChatrooms.chatrooms[chatroomId];
            let messages = chatroom.messages;

            for (let messageId in messages) {
                let message = messages[messageId];
                let messageTime = new Date(message.time).getTime();
                if (messageTime < nextState.startDatetime) {
                    nextState.startDatetime = messageTime;
                }

                if (messageTime > nextState.endDatetime) {
                    nextState.endDatetime = messageTime;
                }
            }
        }
        this.setState(nextState);
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
        if (!this.state) {
            return null;
        }

        return (
            <Aux>
                <ControlPanel />
                <PageWrapper toolbarTitle={this.props.t('Analysis')}>
                    <Fade in className="mt-5 pb-4 container analysis-wrapper">
                        <Card className="mb-5 shadow chsr analyze-body">
                            <h3 className="page-title">
                                <Trans i18nKey="Message analysis" />
                            </h3>

                            <CardBody>
                                <Row>
                                    <AppsSelector className="col-12 col-lg-6 mb-3" onChange={this.onAppChanged} />
                                    <Dropdown className="col-12 col-lg-6 mb-3 chart-dropdown" isOpen={this.state.typeDropdownOpen} toggle={this.toggleTypeDropdown}>
                                        <DropdownToggle className="btn btn-info" caret color="info">
                                            {this.state.selectedDataType.text || this.props.t('Select a data type')}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.dataTypes.map((dataType, i) => (
                                                <DropdownItem key={i} className={dataType.className} onClick={() => this.setState({ selectedDataType: dataType })}>
                                                    {dataType.text}
                                                </DropdownItem>
                                            ))}
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
                                    this.state.selectedDataType.type !== ANALYSIS_TYPES.NONE &&
                                    this.state.selectedDataType.type !== ANALYSIS_TYPES.WORDCLOUR &&
                                    <AnalysisChart className="w-100 h-100 mx-auto chart-body"
                                        dataType={this.state.selectedDataType.type}
                                        appId={this.state.selectedAppId}
                                        appsChatrooms={this.props.appsChatrooms}
                                        startDatetime={this.state.startDatetime}
                                        endDatetime={this.state.endDatetime} />}

                                    {!!this.state.selectedAppId &&
                                    this.state.selectedDataType.type === ANALYSIS_TYPES.WORDCLOUR &&
                                    <WordCloudChart className="w-100 h-100 mx-auto chart-body"
                                        appId={this.state.selectedAppId}
                                        appsChatrooms={this.props.appsChatrooms}
                                        startDatetime={this.state.startDatetime}
                                        endDatetime={this.state.endDatetime} />}
                                </div>
                            </CardBody>
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
        appsChatrooms: storeState.appsChatrooms
    });
};

export default withRouter(withTranslate(connect(mapStateToProps)(Analysis)));
