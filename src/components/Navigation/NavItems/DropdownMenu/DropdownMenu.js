import React from 'react';
import PropTypes from 'prop-types';

import './DropdownMenu.css';

const DropdownMenu = (props) => {
    return (
        <ul className={'chsr dropdown-menu ' + (props.open ? 'open' : 'close')}>
            {props.dropdownItems.map((dropdownItem, i) => (
                <li className="chsr dropdown-item" key={i} onClick={() => props.closed(dropdownItem.link)}>
                    <i className={dropdownItem.icon}></i>
                    {dropdownItem.text}
                </li>
            ))}
        </ul>
    );
};

DropdownMenu.propTypes = {
    dropdownItems: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    closed: PropTypes.func
};

export default DropdownMenu;
