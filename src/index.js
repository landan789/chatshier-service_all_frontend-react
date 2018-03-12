import React from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';

import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import authHelper from './helpers/authentication';
import Routes from './containers/Routes/Routes';

// https://getbootstrap.com/docs/4.0/getting-started/introduction/
import 'bootstrap/dist/css/bootstrap.min.css';
// https://jquense.github.io/react-widgets/
import 'react-widgets/dist/css/react-widgets.css';
import './index.css';

Moment.locale(window.navigator.language);
momentLocalizer(Moment);

ReactDOM.render(<Routes />, document.getElementById('charshier_root'));
// registerServiceWorker();
authHelper.init();
