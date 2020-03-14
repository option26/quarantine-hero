import React, {useState} from 'react';
import './styles/App.css';
import Main from './components/Main.js';
import OfferHelp from './components/OfferHelp.js';
import Dashboard from './components/Dashboard.js';
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
import SuccessOffer from './components/SuccessOffer';
import DSGVO from './components/DSGVO';
import CookieConsent from 'react-cookie-consent';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function App (props) {
  const {
    user,
    signOut,
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col bg-kaki">
      <div className="phone-width bg-white shadow-xl overflow-hidden md:px-16">
        <Router>
          <div className="w-10 h-10 m-5 p-5 rounded fixed top-0 right-0 bg-red-900 flex justify-center items-center text-white" onClick={() => setMenuOpen(true)}>MENU</div>
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/>
          <div className="mt-4 flex justify-between items-center sm:flex-col">
            <div>
              <Link to="/" className="font-bold mr-2 text-sm">Home</Link>
              {user ? <Link to="/dashboard" className="font-bold mr-2 text-sm">Deine Übersicht</Link> : null}
              <Link to="/faq" className="font-bold mx-2 text-sm">FAQs</Link>
              <Link to="/impressum" className="font-bold ml-2 text-sm">Impressum</Link>
              <Link to="/dsgvo" className="font-bold ml-2 text-sm">Datenschutz</Link>
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
              <Dashboard/>
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
            <Route path="/success-offer">
              <SuccessOffer/>
            </Route>
            <Route path="/dsgvo">
              <DSGVO/>
            </Route>
            <Route path="/">
              <Main/>
            </Route>
          </Switch>
        </Router>
      </div>
        <CookieConsent
          location="bottom"
          buttonText="Okay"
          cookieName="myAwesomeCookieName2"
          style={{ background: '#2B373B' }}
          buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
          expires={150}>
          Diese Webseite verwendet Cookies, um das Nutzererlebnis zu verbessern.
        </CookieConsent>
      </div>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
