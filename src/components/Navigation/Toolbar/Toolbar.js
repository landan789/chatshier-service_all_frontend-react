import React from 'react';
import './Toolbar.css';

import Aux from '../../../hoc/Aux';
import NavItems from '../NavItems/NavItems';

const toolbar = (props) => (
    <Aux>
        <header className="Toolbar">
            <nav className="navbar">
                <div className="navbar-header">
                    <a className="navbar-brand" href={'/'}>Chatshier</a>
                </div>    
                <NavItems/>
            </nav>
        </header>
    </Aux>
);

export default toolbar;
