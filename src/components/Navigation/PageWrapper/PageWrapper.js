import React from 'react';
import PropTypes from 'prop-types';

import controlPanelStore from '../../../redux/controlPanelStore';
import Toolbar from '../Toolbar/Toolbar';

import './PageWrapper.css';

class PageWrapper extends React.Component {
    static propTypes = {
        toolbarTitle: PropTypes.string,
        onToggleChatroom: PropTypes.func,
        onToggleProfle: PropTypes.func,
        onToggleTicket: PropTypes.func,
        children: PropTypes.oneOfType([ PropTypes.array, PropTypes.element ])
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
                <Toolbar title={this.props.toolbarTitle}
                    onToggleChatroom={this.props.onToggleChatroom}
                    onToggleProfle={this.props.onToggleProfle}
                    onToggleTicket={this.props.onToggleTicket} />
                {this.props.children}
            </div>
        );
    }
}

export default PageWrapper;
