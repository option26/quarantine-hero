import React from 'react';
import './styles/App.css';
import Main from './components/Main.js';
import Entry from './components/Entry.js';
import FAQ from './components/FAQ.js';
import Impressum from './components/Impressum.js';

import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Signup from "./signup/Signup";
import AskForHelp from "./components/AskForHelp";

function App () {

  return (
    <div>
        <Router>
          <Switch>
            <Route path="/entry/:id">
              <Entry/>
            </Route>
            <Route path="/signup">
              <Signup/>
            </Route>
            <Route path="/ask-for-help">
              <AskForHelp/>
            </Route>
            <Route path="/dashboard">
              <div>Dashboard</div>
            </Route>
            <Route path="/faq">
              <FAQ />
            </Route>
            <Route path="/impressum">
              <Impressum />
            </Route>
            <Route path="/">
              <Main/>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
