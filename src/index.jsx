import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './styles/tailwind.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Internalization
import './i18n';
import Loader from "./components/Loader";

ReactDOM.render(
  <Suspense fallback={<Loader/>}>
    <App/>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
