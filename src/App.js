import React from 'react';
import './styles/App.css';
import Main from './components/Main.js';
import OfferHelp from './components/OfferHelp.js';
import FAQ from './components/FAQ.js';
import Impressum from './components/Impressum.js';
import Signup from "./signup/Signup";
import AskForHelp from "./components/AskForHelp";
import Overview from "./components/Overview";

import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App () {

  return (
    <div className="flex justify-center bg-secondary min-h-screen">
      <div className="phone-width">
        <Router>
          <Switch>
            <Route path="/offer-help/:id">
              <OfferHelp/>
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
            <Route path="/overview">
              <Overview/>
            </Route>
            <Route path="/">
              <Main/>
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
