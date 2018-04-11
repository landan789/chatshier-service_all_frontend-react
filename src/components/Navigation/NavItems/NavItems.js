import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import urlConfig from '../../../config/url';
import regex from '../../../utils/regex';

import NavItem from './NavItem';

import './NavItems.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl
    ? URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '')
    : window.location.protocol + '//' + document.domain.replace(regex.domainPrefix, 'www.');

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
                <NavItem className="d-flex align-items-center h-100" key={i + 1} link={item.link}
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
                <ul className="nav navbar-left nav-items align-items-center h-100">
                    <li className="nav-item d-flex align-items-center h-100">
                        <a className="navbar-brand white ml-3" href={wwwUrl}>
                            <span>Chatshier</span>
                        </a>
                    </li>
                    {leftItems}
                </ul>

                <ul className="nav navbar-right nav-items h-100">
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
