import React from 'react';

import NavItems from '../NavItems/NavItems';
import urlConfig from '../../../config/url';

import './Toolbar.css';

const URL = window.urlConfig || urlConfig;
const wwwUrl = URL.wwwUrl + (80 !== URL.port ? ':' + URL.port : '');

const toolbar = (props) => (
    <header className="toolbar">
        <nav className="navbar normal">
            <div className="navbar-header">
                <a className="navbar-brand" href={wwwUrl}>Chatshier</a>
                <NavItems />
            </div>
        </nav>
        <nav className="navbar mobile">
            <div className="navbar-header">
                <button type="button" className="btn btn-default btn-outline-light">
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </nav>
    </header>
);

export default toolbar;
