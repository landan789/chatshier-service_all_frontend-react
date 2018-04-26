import React from 'react';
import PropTypes from 'prop-types';

class ChatroomPanel extends React.Component {
    render() {
        let props = this.props;
        if (!(props.isOpen && props.appId && props.chatroomId)) {
            return null;
        }

        let className = ((this.props.className || '') + ' chatroom-panel').trim();
        return (
            <div className={className}>
                <div className="w-100 chatroom-body">
                    <div className="chat-content">
                        <div className="h-100 d-flex flex-column message-panel">
                            <div className="message">
                                <div className="messager-name text-right">
                                    <span>www@example.com</span>
                                </div>
                                <span className="message-group right-side">
                                    <span className="content words">fff</span>
                                    <span className="send-time"> (15:01) </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-100 message-input-container">
                    <div className="d-flex align-items-center message-input form-upper">
                        <div className="media-container">
                            <button className="p-0 media-btn">
                                <i className="fas fa-image"></i>
                            </button>
                            <button className="p-0 media-btn">
                                <i className="fas fa-video"></i>
                            </button>
                            <button className="p-0 media-btn">
                                <i className="fa fa-volume-up"></i>
                            </button>
                            <input className="ghost-file d-none" type="file" accept="image/*" />
                            <input className="ghost-file d-none" type="file" accept="video/mp4,video/mpeg4" />
                            <input className="ghost-file d-none" type="file" accept="audio/mp3,video/mpeg3" />
                        </div>
                    </div>
                    <div className="message-input form-lower">
                        <input className="submit-message-input px-2" type="text" placeholder="輸入訊息..." size="35" id="submitMessageInput" />
                        <i className="submit-message-btn p-0 ml-2" id="submitMessageBtn"></i>
                    </div>
                </div>
            </div>
        );
    }
}

ChatroomPanel.propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    appId: PropTypes.string,
    chatroomId: PropTypes.string,
    appsChatrooms: PropTypes.object,
    consumers: PropTypes.object,
    users: PropTypes.object
};

export default ChatroomPanel;
