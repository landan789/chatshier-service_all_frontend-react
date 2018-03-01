import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import Routes from './containers/Routes/Routes';

import './index.css';

ReactDOM.render(<Routes />, document.getElementById('charshier_root'));
registerServiceWorker();
