import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import Linkify from 'react-linkify';

import regex, { wechatEmojiTable } from '../../utils/regex';

class Message extends React.Component {
    static propTypes = {
        shouldRightSide: PropTypes.bool.isRequired,
        senderName: PropTypes.string.isRequired,
        isMedia: PropTypes.bool.isRequired,
        message: PropTypes.object.isRequired,
        messageTime: PropTypes.number.isRequired,
        searchKeyword: PropTypes.string
    }

    render() {
        let props = this.props;
        props.message.text = this._filterWechatEmoji(props.message.text || '');

        let isIncluded = false;
        if (props.searchKeyword) {
            isIncluded = props.message.text.indexOf(props.searchKeyword) >= 0;
        }

        return (
            <div className="mb-3 message">
                <div className={'messager-name ' + (props.shouldRightSide ? 'text-right' : 'text-left')}>
                    <span>{props.senderName}</span>
                </div>
                <span className={'message-group ' + (props.shouldRightSide ? 'right-side' : 'left-side')}>
                    <span className={'content' + (props.isMedia ? ' media' : ' words') + (isIncluded ? ' found' : '')}>
                        {this._messageToJSX(props.message)}
                    </span>
                    <span className="send-time">{this._toTimeStr(props.message.time)}</span>
                </span>
            </div>
        );
    }

    _messageToJSX(message) {
        let text = message.text;
        let src = message.src;
        let template = message.template;

        switch (message.type) {
            case 'image':
                return (
                    <img className="image-content" src={src} alt="" />
                );
            case 'audio':
                return (
                    <audio className="audio-content" controls>
                        <source src={src} type="audio/mpeg" />
                    </audio>
                );
            case 'video':
                return (
                    <video className="video-content" controls playsInline webkit-playsinline="true">
                        <source src={src} type="video/mp4" />
                    </video>
                );
            case 'sticker':
                return (
                    <img className="sticker-content" src={src} alt="" />
                );
            case 'location':
                return (
                    <Aux>
                        <i className="fa fa-location-arrow location-icon"></i>
                        <span>地理位置:</span>
                        <a className="ml-1" target="_blank" href={src}>地圖</a>
                    </Aux>
                );
            case 'template':
                if (!template) {
                    return <span className="text-content">{text}</span>;
                }
                return this._templateMessageType(template);
            case 'file':
                // let fileName = src.split('/').pop();
                return (
                    <Aux>
                        <i className="fas fa-file fa-fw file-icon"></i>
                        <span className="text-content">{text}<a href={src} download={src} target="_blank">{src}</a></span>
                    </Aux>
                );
            default:
                return <span className="text-content"><Linkify>{text}</Linkify></span>;
        }
    }

    _templateMessageType(template) {
        switch (template.type) {
            case 'confirm':
                return (
                    <div className="template-sm">
                        <div className="template-sm-title">{template.text}</div>
                        <div className="template-sm-buttons">
                            <div className="template-sm-button1">{template.actions[0].label} (輸出：{template.actions[0].text})</div>
                            <div className="template-sm-button2">{template.actions[1].label} (輸出：{template.actions[1].text})</div>
                        </div>
                    </div>
                );
            case 'buttons':
                return (
                    <div className="template">
                        <img className="top-img" src={template.thumbnailImageUrl} alt="未顯示圖片" />
                        <div className="template-title">{template.title}</div>
                        <div className="template-desc">{template.text}</div>
                        <div className="template-buttons">
                            <div className="template-button1">{template.actions[0].label} (輸出：{template.actions[0].text})</div>
                            <div className="template-button2">{template.actions[1].label} (輸出：{template.actions[1].text})</div>
                            <div className="template-button3">{template.actions[2].label} (輸出：{template.actions[2].text})</div>
                        </div>
                    </div>
                );
            case 'carousel':
                return template.columns.map((column, i) => (
                    <div key={i} className="template">
                        <img className="top-img" src={column.thumbnailImageUrl} alt="未顯示圖片" />
                        <div className="template-title">{column.title}</div>
                        <div className="template-desc">{column.text}</div>
                        <div className="template-buttons">
                            <div className="template-button1">{column.actions[0].label} (輸出：{column.actions[0].text})</div>
                            <div className="template-button2">{column.actions[1].label} (輸出：{column.actions[1].text})</div>
                            <div className="template-button3">{column.actions[2].label} (輸出：{column.actions[2].text})</div>
                        </div>
                    </div>
                ));
            default:
        }
    }

    /**
     * @param {string} text
     */
    _filterWechatEmoji(text) {
        if (regex.wechatEmojiRegex.test(text)) {
            let emojis = text.match(regex.wechatEmojiRegex) || [];
            let newText = text;
            for (let i = 0; i < emojis.length; i++) {
                newText = newText.replace(emojis[i], wechatEmojiTable[emojis[i]] || emojis[i]);
            }
            return newText;
        }
        return text;
    }

    _toTimeStr(inputDate) {
        let date = new Date(inputDate);
        let addZero = (val) => val < 10 ? '0' + val : val;
        let dateStr = ' (' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ') ';
        return dateStr;
    }
}

export default Message;
