import React from 'react';
import './styles/App.css';
import Main from './components/Main.js';
import Entry from './components/Entry.js';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

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
