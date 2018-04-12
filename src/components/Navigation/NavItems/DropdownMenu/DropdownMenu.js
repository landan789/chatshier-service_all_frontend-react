import React from 'react';
import PropTypes from 'prop-types';
import Aux from 'react-aux';

import './DropdownMenu.css';

const DropdownMenu = (props) => {
    return (
        <ul className={'chsr dropdown-menu ' + (props.open ? 'open' : 'close')}>
            {props.dropdownItems.map((dropdownItem, i) => {
                let itemSymbol = (
                    <li className="chsr dropdown-item" key={i} onClick={() => props.closed(dropdownItem.link)}>
                        <i className={dropdownItem.icon}></i>
                        <span>{dropdownItem.text}</span>
                    </li>
                );

                if (i === props.dropdownItems.length - 1) {
                    return itemSymbol;
                }
                return (
                    <Aux key={i}>
                        {itemSymbol}
                        <hr className="m-0" />
                    </Aux>
                );
            })}
        </ul>
    );
};

DropdownMenu.propTypes = {
    dropdownItems: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    closed: PropTypes.func
};

export default DropdownMenu;
