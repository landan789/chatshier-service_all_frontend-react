import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import DropdownMenu from './DropdownMenu/DropdownMenu';

class NavItem extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            showDropdown: false
        };

        this.onClickItem = this.onClickItem.bind(this);
        this.linkTo = this.linkTo.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ showDropdown: props.showDropdown });
    }

    linkTo(link) {
        if (link && link !== this.props.location.pathname) {
            this.props.history.push(link);
        }
    }

    onClickItem() {
        if (this.props.dropdownItems) {
            return this.props.dropdownToggle();
        }
        this.linkTo(this.props.link);
    }

    render() {
        let itemSymbol =
            <li className={(this.props.className + ' chsr nav-item').trim()}
                onClick={this.onClickItem}>
                {this.props.children}
                {this.props.dropdownItems && (
                    <DropdownMenu
                        dropdownItems={this.props.dropdownItems}
                        open={this.state.showDropdown}
                        closed={this.linkTo}>
                    </DropdownMenu>
                )}
            </li>;

        if (this.props.dropdownItems) {
            return <div className="dropdown-wrapper">{itemSymbol}</div>;
        }
        return itemSymbol;
    }
}

NavItem.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    dropdownItems: PropTypes.array,
    onClick: PropTypes.func,
    showDropdown: PropTypes.bool,
    dropdownToggle: PropTypes.func,
    link: PropTypes.string,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(NavItem);
