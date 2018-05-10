import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import regex, { wechatEmojiTable } from '../../utils/regex';

class Message extends React.Component {
    static propTypes = {
        shouldRightSide: PropTypes.bool.isRequired,
        senderName: PropTypes.string.isRequired,
        isMedia: PropTypes.bool.isRequired,
        messageType: PropTypes.string.isRequired,
        messageText: PropTypes.string.isRequired,
        messageSrc: PropTypes.string.isRequired,
        messageTime: PropTypes.number.isRequired
    }

    render() {
        let props = this.props;

        return (
            <div className="mb-3 message">
                <div className={'messager-name ' + (props.shouldRightSide ? 'text-right' : 'text-left')}>
                    <span>{props.senderName}</span>
                </div>
                <span className={'message-group ' + (props.shouldRightSide ? 'right-side' : 'left-side')}>
                    <span className={'content ' + (props.isMedia ? 'media' : 'words')}>
                        {this._messageToJSX(props.messageType, props.messageText, props.messageSrc)}
                    </span>
                    <span className="send-time">{this._toTimeStr(props.messageTime)}</span>
                </span>
            </div>
        );
    }

    _messageToJSX(type, text, src) {
        switch (type) {
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
                    <video className="video-content" controls playsinline webkit-playsinline>
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
            default:
                return this._filterWechatEmoji(text || '');
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
