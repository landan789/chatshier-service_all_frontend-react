import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import NavItem from './NavItem';

import './NavItems.css';

class NavItems extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            showDropdown: {}
        };

        this.dropdownToggle = this.dropdownToggle.bind(this);

        this.isBackdropShown = false;
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'dropdown-backdrop';
        this.backdrop.addEventListener('click', () => {
            this.dropdownToggle();
            this.hideBackdrop();
        });
    }

    componentWillUnmount() {
        this.hideBackdrop();
    }

    showBackdrop() {
        !this.isBackdropShown && document.body.appendChild(this.backdrop);
        this.isBackdropShown = true;
    }

    hideBackdrop() {
        this.isBackdropShown && document.body.removeChild(this.backdrop);
        this.isBackdropShown = false;
    }

    dropdownToggle(itemKey) {
        let showDropdown = Object.assign({}, this.state.showDropdown);
        for (let k in showDropdown) {
            if (itemKey === k) {
                continue;
            }
            showDropdown[k] = false;
        }

        if (itemKey) {
            showDropdown[itemKey] = !showDropdown[itemKey];
            if (showDropdown[itemKey]) {
                this.showBackdrop();
            } else {
                this.hideBackdrop();
            }
        }
        this.setState({ showDropdown: showDropdown });
    }

    render() {
        let leftItems = [];
        let rightItems = [];
        this.props.items.forEach((item, i) => {
            let container = item.rightSide ? rightItems : leftItems;
            container.push(
                <NavItem key={i + 1} link={item.link}
                    showDropdown={!!this.state.showDropdown[i]}
                    dropdownItems={item.dropdownItems}
                    dropdownToggle={() => this.dropdownToggle(i)}>
                    {item.icon && <i className={item.icon}></i>}
                    {item.text && <span>{item.text}</span>}
                </NavItem>
            );
        });

        return (
            <Aux>
                <ul className="chsr nav-items">
                    {leftItems}
                </ul>

                <ul className="chsr nav-items right">
                    {rightItems}
                </ul>
            </Aux>
        );
    }
};

NavItems.propTypes = {
    items: PropTypes.array
};

export default NavItems;
