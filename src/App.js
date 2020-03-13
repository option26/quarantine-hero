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

function App () {

  return (
    <div className="flex items-center flex-col">
      <header className="phone-width">
        <h1 className="text-6xl text-center">Quarantine Hero</h1>
      </header>
      <section className="phone-width">
        <Router>
          <Switch>
            <Route path="/entry/:id">
              <Entry/>
            </Route>
            <Route path="/signup">
              <Signup/>
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
      </section>
    </div>
  );
}

export default App;
