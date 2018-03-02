import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Alert } from 'reactstrap';

import './Notify.css';

const DURATION = 3000;

class Notify extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        this.setState({ visible: false });
        this.props.onDismiss && this.props.onDismiss();
    }

    render() {
        this.state.visible && window.setTimeout(this.onDismiss, this.props.duration);

        return (
            <Alert
                color={this.props.color}
                isOpen={this.state.visible}
                toggle={this.onDismiss}>
                {this.props.text}
            </Alert>
        );
    }
}

Notify.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    duration: PropTypes.number,
    onDismiss: PropTypes.func
};

const notify = (text, options) => {
    options = options || {};
    options.type = options.type || 'success';
    options.duration = options.duration || DURATION;

    /** @type {React.ReactElement} */
    let notifyElem;
    let dismissPromise = new Promise((resolve) => {
        notifyElem = (
            <Notify
                color={options.type}
                text={text}
                duration={options.duration}
                onDismiss={resolve}>
            </Notify>
        );
    });

    let notifyWapper = document.getElementById('notify_wapper');
    let isOnDom = !!notifyWapper;
    let notifyContainer;

    let notifyItem = document.createElement('div');
    notifyItem.className = 'notify-item';

    if (!isOnDom) {
        notifyWapper = document.createElement('div');
        notifyWapper.id = 'notify_wapper';
        notifyWapper.className = 'notify-wapper';

        notifyContainer = document.createElement('div');
        notifyContainer.className = 'notify-container';

        notifyContainer.appendChild(notifyItem);
        notifyWapper.appendChild(notifyContainer);
        document.body.appendChild(notifyWapper);
    } else {
        notifyContainer = document.querySelector('.notify-container');
        notifyContainer.appendChild(notifyItem);
    }

    let shownPromise = new Promise((resolve) => {
        ReactDOM.render(notifyElem, notifyItem, () => {
            resolve();
        });
    });

    shownPromise.then(() => {
        return dismissPromise;
    }).then(() => {
        ReactDOM.unmountComponentAtNode(notifyItem);
        notifyContainer.removeChild(notifyItem);
        if (!notifyContainer.childElementCount) {
            notifyWapper.removeChild(notifyContainer);
            document.body.removeChild(notifyWapper);
        }
        notifyWapper = notifyContainer = notifyElem = void 0;
    });

    return shownPromise;
};

export default Notify;
export { notify };
