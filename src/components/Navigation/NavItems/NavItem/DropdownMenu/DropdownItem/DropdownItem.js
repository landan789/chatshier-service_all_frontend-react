import React from 'react';

import './DropdownItem.css';

const dropdownItem = (props) => (
    <li className="DropdownItem">
        <a 
            href={props.link}>
            {props.children}</a>
    </li>
);

export default dropdownItem;
