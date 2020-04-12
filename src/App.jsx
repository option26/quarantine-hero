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
import DesktopLowerNavigation from './components/DesktopMenu';
import VerifyEmail from './views/VerifyEmail';
import CompleteOfferHelp from './views/CompleteOfferHelp';
import NotifyMe from './views/NotifyMe';
import useScrollToTop from './components/ScrollToTop';
import ShareButtons from './components/ShareButtons';
import Press from './views/Press';
import createEventListener from './util/createEventListener';
import Security from './views/Security';
import arrowUpIcon from './assets/arrows_up.svg';
import FilteredListFrame from './views/FilteredListFrame';

function DesktopTopNavigation({ isAuthLoading, user, signOut }) {
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

const Page = (props) => {
  // always scroll page to top when changing the pathname
  useScrollToTop();

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

  const MobileTopNavigation = () => (
    <div
      style={{ zIndex: 101 }}
      className="visible md:invisible h-16 w-full fixed top-0 bg-white flex flex-row justify-between w-full items-center pr-5"
    >
      <Link
        to="/"
        className="font-main ml-4"
        style={{ fontWeight: '600' }}
      >
        <img alt="logo" src={require('./assets/logo_invert.svg')} className="h-10" />
      </Link>
      <div>
        <MenuIcon style={{ fontSize: '40px' }} className="text-gray-600" onClick={() => setMenuOpen(true)} />
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center min-h-screen flex-col bg-kaki">

        <DesktopTopNavigation user={user} isAuthLoading={isAuthLoading} signOut={signOut} />
        <MobileTopNavigation />

        <div className="phone-width bg-white shadow-xl min-h-screen md:mt-6">
          <DesktopLowerNavigation isLoggedIn={user} signOut={signOut} />
          <div className="md:px-16 overflow-hidden">
            <div className="mt-20 md:mt-0">
              {props.children}
            </div>
          </div>
        </div>

        <ScrollUpButton
          ContainerClassName="scroll-up-btn"
          TransitionClassName="scroll-up-btn-fade"
        >
          <img alt="arrow-down" className="arrow-down" src={arrowUpIcon} />
        </ScrollUpButton>

        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          isLoggedIn={user}
          signOut={signOut}
        />

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
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/filtered-list-frame">
          <FilteredListFrame />
        </Route>
        <Route path="/offer-help/:id">
          <Frame>
            <OfferHelp />
          </Frame>
        </Route>
        <Route path="/signup/:returnUrl">
          <Frame>
            <Signup />
          </Frame>
        </Route>
        <Route path="/signup">
          <Frame>
            <Signup />
          </Frame>
        </Route>
        <Route path="/signin/:returnUrl">
          <Frame>
            <Signin />
          </Frame>
        </Route>
        <Route path="/signin">
          <Frame>
            <Signin />
          </Frame>
        </Route>
        <Route path="/verify-email">
          <Frame>
            <VerifyEmail />
          </Frame>
        </Route>
        <Route path="/ask-for-help">
          <Frame>
            <AskForHelp />
          </Frame>
        </Route>
        <Route path="/dashboard">
          <Frame>
            <Dashboard />
          </Frame>
        </Route>
        <Route path="/faq">
          <Frame>
            <FAQ />
          </Frame>
        </Route>
        <Route path="/security-tips">
          <Frame>
            <Security />
          </Frame>
        </Route>
        <Route path="/impressum">
          <Frame>
            <Impressum />
          </Frame>
        </Route>
        <Route path="/overview">
          <Frame>
            <Overview />
          </Frame>
        </Route>
        <Route path="/success">
          <Frame>
            <Success />
          </Frame>
        </Route>
        <Route path="/success-offer">
          <Frame>
            <SuccessOffer />
          </Frame>
        </Route>
        <Route path="/dsgvo">
          <Frame>
            <DSGVO />
          </Frame>
        </Route>
        <Route path={['/press', '/presse']}>
          <Frame>
            <Press />
          </Frame>
        </Route>
        <Route path="/notify-me">
          <Frame>
            <NotifyMe />
          </Frame>
        </Route>
        <Route path="/complete-offer-help">
          <Frame>
            <CompleteOfferHelp />
          </Frame>
        </Route>
        <Route exact path="/">
          <Frame>
            <Main />
          </Frame>
        </Route>
        <Route component={NotFound} path="*" />
      </Switch>
    </Router>
  );
}
