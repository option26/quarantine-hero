import React from 'react';
import './styles/App.css';
import Main from './components/Main.js';
import OfferHelp from './components/OfferHelp.js';
import FAQ from './components/FAQ.js';
import Impressum from './components/Impressum.js';
import Signup from './components/Signup';
import AskForHelp from './components/AskForHelp';
import Overview from './components/Overview';
import Success from './components/Success';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from 'firebase';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function App (props) {
  const {
    user,
    signOut,
  } = props;

  return (
    <div className="flex justify-center bg-secondary min-h-screen">
      <div className="phone-width">
        <Router>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <Link to="/" className="font-bold mr-2 text-sm">Home</Link>
              <Link to="/faq" className="font-bold mx-2 text-sm">FAQs</Link>
              <Link to="/impressum" className="font-bold ml-2 text-sm">Impressum</Link>
            </div>
            {user ?
              (<div>
                <span className='text-gray-700 text-sm'>{user.email}</span>
                <button className="bg-primary p-2 ml-4 text-white rounded text-sm" onClick={signOut}>Logout</button>
              </div>)
              : null}
          </div>
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
              <FAQ/>
            </Route>
            <Route path="/impressum">
              <Impressum/>
            </Route>
            <Route path="/overview">
              <Overview/>
            </Route>
            <Route path="/success">
              <Success/>
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

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
