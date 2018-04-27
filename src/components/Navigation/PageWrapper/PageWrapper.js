import React from 'react';
import PropTypes from 'prop-types';

import controlPanelStore from '../../../redux/controlPanelStore';
import Toolbar from '../Toolbar/Toolbar';

import './PageWrapper.css';

class PageWrapper extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.symbol
        ])
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            isPutAway: controlPanelStore.getState().isPutAway
        };

        /** @type {Function} */
        this.storeUnsubscribe = null;
    }

    componentDidMount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
        this.storeUnsubscribe = controlPanelStore.subscribe(() => {
            let isPutAway = controlPanelStore.getState().isPutAway;
            this.setState({ isPutAway: isPutAway });
        });
    }

    componentWillUnmount() {
        this.storeUnsubscribe && this.storeUnsubscribe();
    }

    render() {
        return (
            <div className={('ml-auto w-100 page-wrapper ' + (this.state.isPutAway ? 'put-away' : '')).trim()}>
                <Toolbar />
                {this.props.children}
            </div>
        );
    }
}

export default PageWrapper;
