import React from 'react';
import ReactDOM from 'react-dom';

// At the time of linting style is not available yet.
// in order to spare the CI the step of running yarn build
// we ignore this check here.
// eslint-disable-next-line import/no-unresolved
import './styles/tailwind.css';
import 'react-web-tabs/dist/react-web-tabs.css';

import './styles/index.css';
import './styles/App.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './i18n'; // Internalization

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
