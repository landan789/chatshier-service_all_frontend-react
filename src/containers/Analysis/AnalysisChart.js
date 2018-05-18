import React from 'react';
import PropTypes from 'prop-types';
import { currentLanguage, withTranslate } from '../../i18n';

import { HOUR, DAY, formatDate, formatTime } from '../../utils/unitTime';
import { ANALYSIS_TYPES } from './Analysis';

// https://www.amcharts.com/docs/v3/
// https://github.com/amcharts/amcharts3-react
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

class AnalysisChart extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        className: PropTypes.string,
        dataType: PropTypes.number,
        appId: PropTypes.string.isRequired,
        appsChatrooms: PropTypes.object.isRequired,
        startDatetime: PropTypes.number,
        endDatetime: PropTypes.number
    }

    static defaultProps = {
        className: '',
        startDatetime: Date.now(),
        endDatetime: Date.now()
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            dataProvider: [],
            chartOptions: {
                type: 'serial',
                theme: 'light',
                language: currentLanguage,
                path: '//www.amcharts.com/lib/3/',
                zoomOutButton: {
                    backgroundColor: '#000',
                    backgroundAlpha: 0.15
                },
                dataProvider: [],
                categoryField: 'time',
                categoryAxis: {
                    markPeriodChange: false,
                    dashLength: 1,
                    gridAlpha: 0.15,
                    axisColor: '#dadada',
                    autoWrap: true,
                    fontSize: 10
                },
                valueAxes: [{
                    title: '訊息數',
                    labelFrequency: 1,
                    minimum: 0,
                    baseValue: 999,
                    includeAllValues: true
                }],
                graphs: [{
                    id: 'g1',
                    valueField: 'messages',
                    bullet: 'round',
                    bulletBorderColor: '#fff',
                    bulletBorderThickness: 2,
                    lineThickness: 2,
                    lineColor: '#b5030d',
                    negativeLineColor: '#0352b5',
                    hideBulletsCount: 50
                }],
                chartCursor: {
                    cursorPosition: 'mouse',
                    categoryBalloonEnabled: true
                },
                chartScrollbar: {
                    graph: 'g1',
                    scrollbarHeight: 40,
                    color: '#fff',
                    autoGridCount: true
                },
                listeners: [{
                    event: 'drawn',
                    method: () => {
                        // 每繪製一次 chart 完後，移除 AmCharts 的廣告文字
                        let amChartsAdText = document.querySelector('a[href="http://www.amcharts.com"]');
                        amChartsAdText && amChartsAdText.parentElement.removeChild(amChartsAdText);
                        amChartsAdText = void 0;
                    }
                }]
            }
        };

        /** @type {{[appId: string]: Array}} */
        this.messagesData = {};
    }

    componentDidMount() {
        this.props.appsChatrooms[this.props.appId] && this.prepareMessages(this.props);
        this.messagesData[this.props.appId] && this.renderChart(this.props);
    }

    componentWillReceiveProps(props) {
        props.appsChatrooms[props.appId] && this.prepareMessages(props);
        this.messagesData[props.appId] && this.renderChart(props);
    }

    prepareMessages(props) {
        let appId = props.appId;
        if (this.messagesData[appId]) {
            return;
        }

        let chatrooms = props.appsChatrooms[appId].chatrooms;
        this.messagesData[appId] = [];
        for (let chatroomId in chatrooms) {
            let messages = chatrooms[chatroomId].messages || {};
            let messageIds = Object.keys(messages);
            messageIds.sort((a, b) => {
                // 以時間排序，最早的在前
                return new Date(messages[a].time).getTime() - new Date(messages[b].time).getTime();
            });

            messageIds.forEach((messageId) => {
                let message = messages[messageId];
                if ('text' !== message.type) {
                    return;
                }
                this.messagesData[appId].push(message);
            });
        }
    }

    renderChart(props) {
        let appId = props.appId;
        if (!this.messagesData[props.appId]) {
            return;
        }

        let timelineData = this._retrieveTimelineData(this.messagesData[appId], props);
        let chartData = this._retrieveChartData(timelineData, props);

        let chartOptions = Object.assign({}, this.state.chartOptions);
        chartOptions.dataProvider = chartData;
        this.setState({
            dataProvider: chartData,
            chartOptions: chartOptions
        });
    }

    render() {
        return (
            <AmCharts.React className={this.props.className} options={this.state.chartOptions} />
        );
    }

    /**
     * @param {Array} messagesData
     * @param {any} props
     */
    _retrieveTimelineData(messagesData, props) {
        let timelineData = [];
        let startDatetime = props.startDatetime;
        let endDatetime = props.endDatetime;

        // 將資料過濾成在開始 ~ 結束時間內
        messagesData.forEach((message) => {
            let messageTime = new Date(message.time).getTime();
            if (messageTime >= startDatetime && messageTime <= endDatetime) {
                timelineData.push(messageTime);
            }
        });
        return timelineData;
    }

    /**
     * @param {Array} timelineData
     * @param {any} props
     */
    _retrieveChartData(timelineData, props) {
        let chartData = [];
        let startDatetime = props.startDatetime;
        let endDatetime = props.endDatetime;
        let dataType = props.dataType;
        let startDate = new Date(startDatetime);
        let endDate = new Date(endDatetime);

        let startLabel;
        let endLabel;
        let xAxisLabalMap = {};
        let nowSegment;
        let nextSegment;
        let messageCount = 0;

        switch (dataType) {
            case ANALYSIS_TYPES.MONTH:
                nowSegment = startDatetime; // 當前月份的時間

                let nextDate = new Date(startDatetime);
                nextDate.setMonth(nextDate.getMonth() + 1, endDate.getDate());
                nextDate.setHours(0, 0, 0);
                nextSegment = nextDate.getTime(); // 下個月份的時間

                while (nowSegment < endDatetime) {
                    let messageTime = timelineData.shift();
                    if (messageTime <= nextSegment) {
                        // 若這筆資料的時間還沒到下個月，則當前月份訊息數++
                        messageCount++;
                        continue;
                    }

                    // 若這筆資料已到下個月，則結算當前月份
                    let nowSegmentDate = new Date(nowSegment); // 當前月份
                    let xAxisLabal = this.props.t(nowSegmentDate.toLocaleString('en-us', { month: 'long' }));
                    xAxisLabalMap[xAxisLabal] = true;

                    chartData.push({
                        time: xAxisLabal,
                        messages: messageCount
                    });
                    nowSegment = nextSegment; // 開始計算下個月份
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    nextSegment = nextDate.getTime();
                    messageCount = 0;
                    timelineData.unshift(messageTime); // 把不符合判斷式的 data 加回陣列
                }

                // 將起始時間與結束時間加入資料內以便顯示時間區間
                startLabel = this.props.t(startDate.toLocaleString('en-us', { month: 'long' }));
                endLabel = this.props.t(endDate.toLocaleString('en-us', { month: 'long' }));

                !xAxisLabalMap[startLabel] && chartData.unshift({
                    time: startLabel,
                    messages: messageCount
                });
                xAxisLabalMap[startLabel] = true;

                !xAxisLabalMap[endLabel] && chartData.push({
                    time: endLabel,
                    messages: messageCount
                });
                xAxisLabalMap[endLabel] = true;
                break;
            case ANALYSIS_TYPES.DAY:
                nowSegment = Math.floor(startDatetime / DAY) * DAY; // 取得第一天的00:00的時間
                nextSegment = nowSegment + DAY;

                while (nowSegment < endDatetime) {
                    let messageTime = timelineData.shift();
                    if (messageTime <= nextSegment) {
                        messageCount++;
                        continue;
                    }

                    let nowSegmentDate = new Date(nowSegment);
                    let xAxisLabal = formatDate(nowSegmentDate, false);
                    xAxisLabalMap[xAxisLabal] = true;
                    chartData.push({
                        time: xAxisLabal,
                        messages: messageCount
                    });

                    messageCount = 0;
                    nowSegment = nextSegment;
                    nextSegment += DAY;
                    timelineData.unshift(messageTime); // 把不符合判斷式的 data 加回陣列
                }

                // 將開始時間與結束時間加入資料內以便顯示時間區間
                endLabel = formatDate(endDate, false);
                !xAxisLabalMap[endLabel] && chartData.push({
                    time: endLabel,
                    messages: messageCount
                });
                xAxisLabalMap[endLabel] = true;
                break;
            case ANALYSIS_TYPES.HOUR:
                nowSegment = Math.floor(startDatetime / HOUR) * HOUR;
                while (nowSegment < endDatetime) {
                    let messageTime = timelineData.shift();
                    if (messageTime <= (nowSegment + HOUR)) {
                        messageCount++;
                        continue;
                    }

                    let nowSegmentDate = new Date(nowSegment);
                    let xAxisLabal = formatDate(nowSegmentDate, false) + ' ' + formatTime(nowSegmentDate, false);
                    xAxisLabalMap[xAxisLabal] = true;

                    chartData.push({
                        time: xAxisLabal,
                        messages: messageCount
                    });
                    messageCount = 0;
                    nowSegment += HOUR;
                    timelineData.unshift(messageTime); // 把第一筆不符合判斷式的data加回陣列
                }

                // 將起始時間與結束時間加入資料內以便顯示時間區間
                endLabel = formatDate(endDate, false) + ' ' + formatTime(endDate, false);
                !xAxisLabalMap[endLabel] && chartData.push({
                    time: endLabel,
                    messages: messageCount
                });
                xAxisLabalMap[endLabel] = true;
                break;
            case ANALYSIS_TYPES.TIME:
                // 建立陣列，儲存不同小時的訊息數
                let hoursArray = Array(24).fill(0);
                while (timelineData.length > 0) {
                    let time = timelineData.shift();
                    let hour = new Date(time).getHours();
                    hoursArray[hour]++; // 取得每個訊息的小時，並加至陣列裡
                }

                for (let i = 0; i < 24; i++) {
                    let hr = (i < 10 ? '0' : '') + i;
                    chartData.push({
                        time: hr + ':00',
                        messages: hoursArray[i]
                    });
                }
                break;
            default:
                break;
        }
        return chartData;
    }
}

export default withTranslate(AnalysisChart);
