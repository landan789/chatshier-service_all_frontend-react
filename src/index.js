import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';

import firebaseConfig from './config/firebase';
import Routes from './containers/Routes/Routes';

import './index.css';

ReactDOM.render(<Routes />, document.getElementById('charshier_root'));
registerServiceWorker();
firebase.initializeApp(window.config || firebaseConfig);
