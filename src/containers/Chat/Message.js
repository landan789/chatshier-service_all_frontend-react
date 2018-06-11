import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';
import Linkify from 'react-linkify';
import { Badge } from 'reactstrap';

import apiDatabase from '../../helpers/apiDatabase/index';
import regex, { wechatEmojiTable } from '../../utils/regex';

import './Message.css';

class Message extends React.Component {
    static propTypes = {
        appType: PropTypes.string.isRequired,
        shouldRightSide: PropTypes.bool.isRequired,
        senderName: PropTypes.string.isRequired,
        isMedia: PropTypes.bool.isRequired,
        message: PropTypes.object.isRequired,
        messageTime: PropTypes.number.isRequired,
        searchKeyword: PropTypes.string
    }

    renderImageContentBadge(type) {
        switch (type) {
            case 'template':
                return <Badge className="mr-2 px-2 py-1 template-btn" color="dark" pill>模板訊息</Badge>;
            case 'imagemap':
                return <Badge className="mr-2 px-2 py-1 template-btn" color="dark" pill>圖文訊息</Badge>;
            default:
                return null;
        }
    }

    render() {
        let props = this.props;
        props.message.text = this._filterWechatEmoji(props.message.text || '');

        let isIncluded = false;
        if (props.searchKeyword) {
            isIncluded = props.message.text.indexOf(props.searchKeyword) >= 0;
        }

        let contentType = this._getImageContentType(props.message);
        let messageClass = 'content' + (props.isMedia ? ' media' : ' words') + (isIncluded ? ' found' : '') + ' ' + contentType;

        return (
            <div className="mb-3 message">
                <div className={'messager-name ' + (props.shouldRightSide ? 'text-right' : 'text-left')}>
                    {this.renderImageContentBadge(props.message.type)}
                    <span>{props.senderName}</span>
                </div>
                <span className={'message-group ' + (props.shouldRightSide ? 'right-side' : 'left-side')}>
                    <span className={messageClass.trim()}>
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
                    <div className="w-100 h-100 image-container">
                        <img className="image-content" src={src} alt="" />
                    </div>
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
                // 目前錢掌櫃的模板訊息尚未支援 FACEBOOK
                // 因此不顯示模板訊息
                if (apiDatabase.apps.TYPES.FACEBOOK === this.props.appType) {
                    return null;
                }

                if (!template) {
                    return <span className="text-content"><Linkify>{text}</Linkify></span>;
                }
                return this._renderTemplateMessage(template);
            case 'file':
                // let fileName = src.split('/').pop();
                return (
                    <Aux>
                        <i className="fas fa-file fa-fw file-icon"></i>
                        <span className="text-content">{text}<a href={src} download={src} target="_blank">{src}</a></span>
                    </Aux>
                );
            case 'imagemap':
                return (
                    <div className="imagemap-message-container">
                        {message.src && <img className="imagemap-image" src={message.src} alt="" />}
                        {message.imagemap && <div className="imagemap-message-content row mx-0">{this._photoFormShow(message.imagemap)}</div>}
                    </div>
                );
            case 'text':
                return <span className="text-content"><Linkify>{text}</Linkify></span>;
            default:
                return null;
        }
    }

    _renderTemplateMessage(template) {
        const getTemplateOutput = (action) => {
            switch (action.type) {
                case 'uri':
                    return action.uri;
                default:
                    return action.text;
            }
        };

        return (
            <div className="d-flex template-container">
                {(() => {
                    switch (template.type) {
                        case 'confirm':
                            return (
                                <div className="template-sm">
                                    <div className="d-flex flex-wrap align-items-center template-sm-title">
                                        <span className="p-2">${18 >= template.text.length ? template.text : `${template.text.substring(0, 17)}...`}</span>
                                    </div>
                                    <div className="d-flex flex-row justify-content-between template-sm-buttons">
                                        {template.actions.map((action, i) => (
                                            <div key={i} className={'d-flex flex-column justify-content-center my-auto template-sm-button' + (i + 1)}>
                                                <span className="template-confirm pl-1">${8 >= action.label.length ? action.label : `${action.label.substring(0, 6)}...`}</span>
                                                <span className="template-confirm pl-1">(${4 >= getTemplateOutput(action).length ? getTemplateOutput(action) : `${getTemplateOutput(action).substring(0, 4)}...`})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        case 'buttons':
                            return (
                                <div className="template ml-1">
                                    <div className="text-center top-img-container">
                                        <img src={template.thumbnailImageUrl} className="template-image" alt="未顯示圖片" />
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center py-1 px-3 template-title">
                                        <span className="template-title">{template.title}</span>
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center py-1 px-3 template-desc">
                                        <span className="template-desc">{template.text}</span>
                                    </div>
                                    <div className="d-flex flex-column template-buttons">
                                        {template.actions.map((action, i) => (
                                            <div key={i} className={'d-flex flex-column justify-content-center my-1 text-center template-button' + (i + 1)}>
                                                <span className="template-button pl-3">{10 >= action.label.length ? action.label : `${action.label.substring(0, 9)}...`}</span>
                                                <span className="template-button pl-3">(輸出：${10 >= getTemplateOutput(action).length ? getTemplateOutput(action) : `${getTemplateOutput(action).substring(0, 9)}...`})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        case 'carousel':
                            return template.columns.map((column, i) => (
                                <div key={i} className="template ml-1">
                                    <div className="text-center top-img-container">
                                        <img src={column.thumbnailImageUrl} className="template-image" alt="未顯示圖片" />
                                    </div>

                                    <div className="d-flex flex-wrap align-items-center py-1 px-3 template-title">
                                        <span className="template-title">{column.title}</span>
                                    </div>

                                    <div className="d-flex flex-wrap align-items-center py-1 px-3 template-desc">
                                        <span className="template-desc">{column.text}</span>
                                    </div>

                                    <div className="d-flex flex-column template-buttons">
                                        {column.actions.map((action, i) => (
                                            <div key={i} className={'d-flex flex-column justify-content-center my-1 text-center template-button' + (i + 1)}>
                                                <span className="template-button pl-3">{10 >= action.label.length ? action.label : `${action.label.substring(0, 9)}...`}</span>
                                                <span className="template-button pl-3">(輸出：${10 >= getTemplateOutput(action).length ? getTemplateOutput(action) : `${getTemplateOutput(action).substring(0, 9)}...`})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ));
                        default:
                    }
                })()}
            </div>
        );
    }

    _getImageContentType(message) {
        switch (message.type) {
            case 'template':
                return ` ${message.template.type}-format`;
            case 'imagemap':
                return ' imagemap-format';
            default:
                return '';
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

    _photoFormShow(imagemap) {
        const imagemapLink = (url) => {
            return (
                <span className="p-3 imagemap-text-space">
                    <a href={url} target="_blank">導入連結</a>
                </span>
            );
        };

        const imagemapText = (text) => {
            return <span className="p-3 imagemap-text-space">{text}</span>;
        };

        switch (imagemap.form) {
            case 'form8':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [];
                            for (let i = 0; i < 6; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="box" style={{ width: '33%', paddingTop: '20%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form7':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [
                                <div key={'box1'} className="w-100 h-50 box" style={{ paddingTop: '20%' }}>
                                    {!imagemap.actions[0].text ? imagemapLink(imagemap.actions[0].linkUri) : imagemapText(imagemap.actions[0].text)}
                                </div>
                            ];
                            for (let i = 1; i < 3; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="w-100 h-25 box" style={{ paddingTop: '10%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form6':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [
                                <div key={'box1'} className="w-100 box" style={{ paddingTop: '20%' }}>
                                    {!imagemap.actions[0].text ? imagemapLink(imagemap.actions[0].linkUri) : imagemapText(imagemap.actions[0].text)}
                                </div>
                            ];
                            for (let i = 1; i < 3; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="w-50 box" style={{ paddingTop: '20%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form5':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [];
                            for (let i = 0; i < 4; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="w-50 box" style={{ paddingTop: '20%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form4':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [];
                            for (let i = 0; i < 3; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="w-100 box" style={{ paddingTop: '13%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form3':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [];
                            for (let i = 0; i < 2; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="w-100 box" style={{ paddingTop: '20%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form2':
                return (
                    <Aux>
                        {(() => {
                            let boxes = [];
                            for (let i = 0; i < 2; i++) {
                                boxes.push(
                                    <div key={'box' + (i + 1)} className="box" style={{ paddingTop: '45%' }}>
                                        {!imagemap.actions[i].text ? imagemapLink(imagemap.actions[i].linkUri) : imagemapText(imagemap.actions[i].text)}
                                    </div>
                                );
                            }
                            return boxes;
                        })()}
                    </Aux>
                );
            case 'form1':
                return (
                    <div className="w-100 box" style={{ paddingTop: '45%' }}>
                        {!imagemap.actions[0].text ? imagemapLink(imagemap.actions[0].linkUri) : imagemapText(imagemap.actions[0].text)}
                    </div>
                );
            default:
                return null;
        }
    }
}

export default Message;
