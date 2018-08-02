import React from 'react';
import PropTypes from 'prop-types';
import { withTranslate } from '../../i18n';

import './SearchBar.css';

class SearchBar extends React.Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        className: PropTypes.string,
        keyword: PropTypes.string,
        onChange: PropTypes.func.isRequired
    }

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            keyword: props.keyword || ''
        };
    }

    render() {
        let className = 'd-flex mx-0 search-bar ' + (this.props.className || '');
        return (
            <div className={className.trim()}>
                <input className="m-auto search-input"
                    type="text"
                    placeholder={this.props.t('Search')}
                    maxLength={50}
                    value={this.state.keyword}
                    onChange={this.onChange} />
            </div>
        );
    }
}

export default withTranslate(SearchBar);
