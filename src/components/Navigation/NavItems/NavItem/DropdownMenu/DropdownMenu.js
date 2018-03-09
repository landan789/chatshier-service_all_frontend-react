import React from 'react';

import './DropdownMenu.css';
import Aux from '../../../../../hoc/Aux';
import DropdownItem from './DropdownItem/DropdownItem';

const dropdownMenu = (props) => {
    return (
        <Aux>
            <ul className={'DropdownMenu ' + (props.open ? 'Open' : 'Close')}>
                {
                    (() => {
                        return props.dropdownItems.map((dropdownItem, i) => {
                            return (
                                <DropdownItem key={i} link={dropdownItem.link}><i className={dropdownItem.icon}></i>{dropdownItem.text}</DropdownItem>
                            );
                        });
                    })()
                }
            </ul>
        </Aux>
    );
};
export default dropdownMenu;
