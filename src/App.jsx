import React, { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import ScrollUpButton from 'react-scroll-up-button';
import MenuIcon from '@material-ui/icons/Menu';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/browser';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Main from './views/Main';
import OfferHelp from './views/OfferHelp';
import Dashboard from './views/Dashboard';
import FAQ from './views/FAQ';
import Impressum from './views/Impressum';
import Signup from './views/Signup';
import Signin from './views/Signin';
import AskForHelp from './views/AskForHelp';
import Overview from './views/Overview';
import Success from './views/Success';
import NotFound from './views/NotFound';
import fb from './firebase';
import SuccessOffer from './views/SuccessOffer';
import DSGVO from './views/DSGVO';
import Sidebar from './components/Sidebar';
import DesktopMenu from './components/DesktopMenu';
import VerifyEmail from './views/VerifyEmail';
import CompleteOfferHelp from './views/CompleteOfferHelp';
import NotifyMe from './views/NotifyMe';
import ScrollToTop from './components/ScrollToTop';
import ShareButtons from './components/ShareButtons';
import Press from './views/Press';
import createEventListener from './util/createEventListener';
import Security from './views/Security';

function TopNavigation({ isAuthLoading, user, signOut }) {
  const { t } = useTranslation();

  // if the user is not logged in or authentication is loading
  // show only "Login" and "Presse" in top navigation
  if (isAuthLoading || !user) {
    return (
      <div className="hidden md:flex justify-end md:mt-12 w-full phone-width items-center">
        <Link
          className="mr-6 font-open-sans text-gray-700"
          to="/signin/dashboard"
        >
          {t('App.login')}
        </Link>
        <Link className="mr-6 font-open-sans text-gray-700" to="/press">{t('App.press')}</Link>
        <ShareButtons />
      </div>
    );
  }

  // if the user is logged in show
  // "Meine Übersicht", "Logout", "Dashboard" and "Presse" in top navigation
  return (
    <div className="hidden md:flex justify-end md:mt-12 w-full phone-width items-center">
      <Link
        data-cy="nav-my-overview"
        className="mr-6 font-open-sans text-gray-700"
        to="/dashboard"
      >
        {t('components.desktopMenu.myOverview')}
      </Link>
      <button
        type="button"
        data-cy="btn-sign-out"
        className="mr-4 font-open-sans text-gray-700"
        onClick={signOut}
      >
        {t('components.desktopMenu.signOut')}
      </button>
      <Link
        className="mr-6 font-open-sans text-gray-700"
        to="/press"
      >
        {t('App.press')}
      </Link>
      <ShareButtons />
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [user, isAuthLoading] = useAuthState(firebase.auth());
  const signOut = () => firebase.auth().signOut();

  const enableAnalytics = () => {
    // Crash reporting
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_ENV,
    });

    // Firebase analytics
    fb.analytics = fb.app.analytics();
    const handleHashChange = () => {
      const hash = document.location.hash;
      fb.analytics.logEvent('page_view', { page_path: hash.substring(1) });
    };
    handleHashChange();

    return createEventListener(window, 'hashchange', handleHashChange);
  };

  useEffect(() => {
    if (document.cookie.indexOf('cookieConsent') > -1) {
      return enableAnalytics();
    }
    return undefined;
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center min-h-screen flex-col bg-kaki">
      <Router>
        <TopNavigation user={user} isAuthLoading={isAuthLoading} signOut={signOut} />
        <div className="phone-width bg-white shadow-xl min-h-screen md:mt-6">
          <ScrollToTop />
          <DesktopMenu isLoggedIn={user} signOut={signOut} />
          <div className="md:px-16 overflow-hidden">
            <div style={{ zIndex: 101 }} className="visible md:invisible h-16 w-full fixed top-0 bg-white flex flex-row justify-between w-full items-center pr-5">
              <Link to="/" className="font-main ml-4" style={{ fontWeight: '600' }}>
                <img alt="logo" src={require('./assets/logo_invert.svg')} className="h-10" />
              </Link>
              <div>
                <MenuIcon style={{ fontSize: '40px' }} className="text-gray-600" onClick={() => setMenuOpen(true)} />
              </div>
            </div>
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} isLoggedIn={user} signOut={signOut} />
            <div className="mt-20 md:mt-0">
              <Switch>
                <Route path="/offer-help/:id">
                  <OfferHelp />
                </Route>
                <Route path="/signup/:returnUrl">
                  <Signup />
                </Route>
                <Route path="/signup">
                  <Signup />
                </Route>
                <Route path="/signin/:returnUrl">
                  <Signin />
                </Route>
                <Route path="/signin">
                  <Signin />
                </Route>
                <Route path="/verify-email">
                  <VerifyEmail />
                </Route>
                <Route path="/ask-for-help">
                  <AskForHelp />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/faq">
                  <FAQ />
                </Route>
                <Route path="/security-tips">
                  <Security />
                </Route>
                <Route path="/impressum">
                  <Impressum />
                </Route>
                <Route path="/overview">
                  <Overview />
                </Route>
                <Route path="/success">
                  <Success />
                </Route>
                <Route path="/success-offer">
                  <SuccessOffer />
                </Route>
                <Route path="/dsgvo">
                  <DSGVO />
                </Route>
                <Route path={['/press', '/presse']}>
                  <Press />
                </Route>
                <Route path="/notify-me">
                  <NotifyMe />
                </Route>
                <Route path="/complete-offer-help">
                  <CompleteOfferHelp />
                </Route>
                <Route exact path="/">
                  <Main />
                </Route>
                <Route component={NotFound} path="*" />
              </Switch>
              <ScrollUpButton
                ContainerClassName="scroll-up-btn"
                TransitionClassName="scroll-up-btn-fade"
              >
                <img alt="arrow-down" className="arrow-down" src={require('./assets/arrows_up.svg')} />
              </ScrollUpButton>
            </div>
          </div>
        </div>
      </Router>
      <CookieConsent
        location="bottom"
        buttonText="Okay"
        cookieName="cookieConsent"
        style={{ background: '#2B373B' }}
        buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
        onAccept={enableAnalytics}
        expires={365}
      >
        {t('App.usesCookies')}
      </CookieConsent>
    </div>
  );
}
