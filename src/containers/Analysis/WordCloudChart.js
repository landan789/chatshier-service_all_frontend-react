import React from 'react';
import PropTypes from 'prop-types';

import * as WordCloud from 'wordcloud/src/wordcloud2';
import { WordFreq } from './wordfreq';

class WordCloudChart extends React.Component {
    static propTypes = {
        className: PropTypes.string,
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

        /** @type {HTMLElement} */
        this.elem = void 0;
        this.wordFreq = void 0;
        this.wordsData = {};
    }

    componentDidMount() {
        this.props.appsChatrooms[this.props.appId] && this.prepareMessages(this.props);
        this.showWordCloud(this.props);
    }

    componentWillUnmount() {
        this.wordFreq && this.wordFreq.stop() && this.wordFreq.empty();
        this.wordFreq = void 0;
    }

    prepareMessages(props) {
        let appId = props.appId;
        if (this.wordsData[appId]) {
            return;
        }

        let chatrooms = props.appsChatrooms[appId].chatrooms;
        this.wordsData[appId] = [];
        for (let chatroomId in chatrooms) {
            let messages = chatrooms[chatroomId].messages || {};
            let messageIds = Object.keys(messages);

            messageIds.forEach((messageId) => {
                let message = messages[messageId];
                if ('text' !== message.type) {
                    return;
                }
                this.wordsData[appId].push(message.text);
            });
        }
    }

    showWordCloud(props) {
        if (!(this.elem && props.appId && this.wordsData[props.appId])) {
            return;
        }

        this.wordFreq && this.wordFreq.stop() && this.wordFreq.empty();
        this.wordFreq = new WordFreq({
            workerUrl: '/lib/js/wordfreq.worker.js',
            minimumCount: 1 // 過濾文字出現的最小次數最小
        });

        return new Promise((resolve) => {
            let totalWords = this.wordsData[props.appId].join(',');
            this.wordFreq.process(totalWords, resolve);
        }).then((wordList) => {
            let wordCloudOpts = {
                list: wordList,
                // 文字雲字體基本大小
                weightFactor: 24,
                minSize: 8,
                clearCanvas: true,
                backgroundColor: '#eafaff'
            };
            WordCloud(this.elem, wordCloudOpts);
        });
    }

    render() {
        return (
            <div className={this.props.className} ref={(elem) => (this.elem = elem)}></div>
        );
    }
}

export default WordCloudChart;
