import React, {Component } from 'react';

import Aux from '../../hoc/Aux';
import classes from './Layout';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import DropdownItems from '../Navigation/NavItems/NavItem/DropdownMenu/DropdownItem/DropdownItem';

class Layout extends Component {
    

    render () {
        return (
            <Aux>
                <Toolbar />
                <main>
                    {this.props.children}
                </main>

            </Aux>
        )
    }
}

export default Layout;
