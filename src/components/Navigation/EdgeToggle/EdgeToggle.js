import React from 'react';
import PropTypes from 'prop-types';

import './EdgeToggle.css';

class EdgeToggle extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func
    }

    static defaultProps = {
        className: '',
        onClick: () => void 0
    }

    render() {
        return (
            <div className={('edge-toggle-container ' + this.props.className).trim()}>
                <button className="edge-toggle-btn" onClick={this.props.onClick}>
                    <i className="fas fa-minus"></i>
                </button>
            </div>
        );
    }
}

export default EdgeToggle;
