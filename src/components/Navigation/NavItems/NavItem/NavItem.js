import React from 'react';
import './NavItem.css';

const navItem = (props) => (
    <li className="NavItem" onClick={props.onClick}>
        <a 
            href={props.link}>
            {props.children}</a>
    </li>
);

export default navItem;
