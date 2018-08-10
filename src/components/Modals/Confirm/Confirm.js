import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './Confirm.css';

class ConfirmModal extends React.Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        confirmText: PropTypes.string.isRequired,
        confirmColor: PropTypes.string.isRequired,
        cancelText: PropTypes.string.isRequired,
        cancelColor: PropTypes.string.isRequired,
        onClose: PropTypes.func
    }

    static defaultProps = {
        className: ''
    }

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: true
        };

        this.close = this.close.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    close(isConfirm = true) {
        if (!this.state.modalOpen) {
            return;
        }

        this.setState({ modalOpen: false });
        if ('function' === typeof this.props.onClose) {
            this.props.onClose(isConfirm);
        }
    }

    confirm() {
        this.close(true);
    }

    cancel() {
        this.close(false);
    }

    render() {
        if (!this.state.modalOpen) {
            return null;
        }

        const {
            message,
            title,
            confirmText,
            cancelText,
            confirmColor,
            cancelColor,
            className
        } = this.props;

        let modalHeader = null;
        let cancelButton = null;

        if (title) {
            modalHeader = (
                <ModalHeader toggle={this.cancel}>{title}</ModalHeader>
            );
        }

        if (cancelText) {
            cancelButton = (
                <Button color={cancelColor} onClick={this.cancel}>
                    {cancelText}
                </Button>
            );
        }

        return (
            <Modal isOpen={this.state.modalOpen} backdrop={false} className={className}>
                {modalHeader}
                <ModalBody>{message}</ModalBody>
                <ModalFooter>
                    {cancelButton}{' '}
                    <Button color={confirmColor} onClick={this.confirm}>
                        {confirmText}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

/**
 * @typedef ConfirmOptions
 * @property {string} message
 * @property {string} title
 * @property {string} confirmText
 * @property {string} cancelText
 * @property {string} confirmColor
 * @property {string} cancelColor
 * @param {ConfirmOptions} options
 */
const confirm = (options) => {
    options = Object.assign({
        message: 'Are you sure?',
        title: 'Warning!',
        confirmText: 'Ok',
        confirmColor: 'primary',
        cancelText: 'Cancel',
        cancelColor: 'light'
    }, options || {});

    let container = document.createElement('div');
    container.className = 'confirm-container';
    document.body.appendChild(container);

    let confirmModal;
    let confirmPromise = new Promise((resolve) => {
        confirmModal = (
            <ConfirmModal className="position-absolute w-100 m-0 confirm-dialog"
                message={options.message}
                title={options.title}
                confirmText={options.confirmText}
                confirmColor={options.confirmColor}
                cancelText={options.cancelText}
                cancelColor={options.cancelColor}
                onClose={resolve} />
        );
    });

    return new Promise((resolve) => {
        ReactDOM.render(confirmModal, container, resolve);
    }).then(() => {
        return confirmPromise;
    }).then((isConfirm) => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        confirmModal = container = void 0;
        return isConfirm;
    });
};

export default confirm;
