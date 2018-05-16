import React from 'react';
import PropTypes from 'prop-types';

// https://www.amcharts.com/docs/v4/
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

class AnalysisChart extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        appId: PropTypes.string.isRequired,
        appsChatrooms: PropTypes.object.isRequired
    }

    static defaultProps = {
        className: ''
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.chart = void 0;

        /** @type {HTMLElement} */
        this.elem = void 0;
        /** @type {{[appId: string]: Array}} */
        this.messagesData = {};

        this.initAmChart = this.initAmChart.bind(this);
    }

    componentDidMount() {
        this.props.appsChatrooms[this.props.appId] && this.prepareMessages(this.props.appId);
        this.messagesData[this.props.appId] && this.renderChart();
    }

    componentWillReceiveProps(props) {
        props.appsChatrooms[props.appId] && this.prepareMessages(props.appId);
        this.messagesData[props.appId] && this.renderChart();
    }

    /**
     * @param {string} appId
     */
    prepareMessages(appId) {
        if (this.messagesData[appId]) {
            return;
        }

        let chatrooms = this.props.appsChatrooms[appId].chatrooms;
        this.messagesData[appId] = [];
        for (let chatroomId in chatrooms) {
            let messages = chatrooms[chatroomId].messages || {};
            for (let messageId in messages) {
                let message = messages[messageId];
                if ('text' !== message.type) {
                    continue;
                }
                this.messagesData[appId].push(message);
            }
        }
    }

    renderChart() {
        if (!this.chart) {
            return;
        }
        this.chart.data = this.messagesData[this.props.appId];
        console.log(this.chart.data);

        let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'messages';
        categoryAxis.title.text = 'Text';
        let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = 'Litres sold (M)';
    }

    initAmChart(elem) {
        this.elem = elem;
        if (!elem) {
            this.chart.dispose();
            this.chart = void 0;
            return;
        }

        this.chart = am4core.create(elem, am4charts.XYChart);
    }

    render() {
        return (
            <div className={this.props.className} ref={this.initAmChart}></div>
        );
    }
}

export default AnalysisChart;
