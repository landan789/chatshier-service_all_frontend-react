import React from 'react';
import PropTypes from 'prop-types';

class ModalCore extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        close: PropTypes.func.isRequired
    }

    static defaultProps = {
        isOpen: true
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isOpen: this.props.isOpen
        };

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(data) {
        if (!this.state.isOpen) {
            return Promise.resolve(this.props.close(data));
        }
        return new Promise((resolve) => {
            this.setState({ isOpen: false });
            window.setTimeout(resolve, 300);
        }).then(() => this.props.close(data));
    }
}

export default ModalCore;
