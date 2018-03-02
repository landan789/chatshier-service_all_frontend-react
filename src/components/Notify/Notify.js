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
            <Alert color={this.props.color} isOpen={this.state.visible} toggle={this.onDismiss}>
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

    /** @type {React.DOMElement} */
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

    let notifyWapper = document.createElement('div');
    let notifyContainer = document.createElement('div');
    notifyWapper.className = 'notify-wapper';
    notifyContainer.className = 'notify-container';
    notifyWapper.appendChild(notifyContainer);
    document.body.appendChild(notifyWapper);

    return new Promise((resolve) => {
        ReactDOM.render(notifyElem, notifyContainer, () => {
            document.body.appendChild(notifyWapper);
            resolve();
        });
    }).then(() => {
        return dismissPromise;
    }).then(() => {
        document.body.removeChild(notifyWapper);
        notifyWapper = notifyContainer = notifyElem = dismissPromise = void 0;
    });
};

export default Notify;
export { notify };
