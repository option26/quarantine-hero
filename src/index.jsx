import React from 'react';
import ReactDOM from 'react-dom';

// At the time of linting style is not available yet.
// in order to spare the CI the step of running yarn build
// we ignore this check here.
// eslint-disable-next-line import/no-unresolved
import './styles/tailwind.css';

import './styles/index.css';
import './styles/App.css';
import App from './App';
import './i18n'; // Internalization

ReactDOM.render(<App />, document.getElementById('root'));
