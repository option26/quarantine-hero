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
import Imprint from './views/Imprint';
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
import Footer from './components/Footer';
import HandleEmailAction from './views/HandleEmailAction';

function DesktopTopNavigation({ isAuthLoading, user, signOut }) {
  const { t } = useTranslation();

  // Depending on the user auth status, show different elements in the top navigation
  return (
    <div className="hidden md:flex justify-end md:mt-12 w-full phone-width items-center">
      {isAuthLoading || !user
        ? (
          <Link
            className="mr-4 font-open-sans text-gray-700"
            to="/signin/dashboard"
          >
            {t('App.login')}
          </Link>
        ) : (
          <>
            <Link
              data-cy="nav-my-overview"
              className="mr-4 font-open-sans text-gray-700"
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
          </>
        )}
      <Link
        className="mr-4 font-open-sans text-gray-700"
        to="/faq"
      >
        {t('components.desktopMenu.FAQs')}
      </Link>
      <Link
        className="mr-4 font-open-sans text-gray-700"
        to="/press"
      >
        {t('App.press')}
      </Link>
      <ShareButtons />
    </div>
  );
}

const MobileTopNavigation = ({ onMenuIconClick }) => (
  <div className="w-full visible md:invisible">
    <div
      style={{ zIndex: 101 }}
      className="h-16 w-full fixed top-0 bg-white flex flex-row justify-between items-center pr-5"
    >
      <Link
        to="/"
        className="font-main ml-4"
        style={{ fontWeight: '600' }}
      >
        <img alt="logo" src={require('./assets/logo_invert.svg')} className="h-10" />
      </Link>
      <div>
        <MenuIcon style={{ fontSize: '40px' }} className="text-gray-600" onClick={onMenuIconClick} data-cy="mobile-menu-icon" />
      </div>
    </div>
  </div>
);

const Page = ({ children }) => {
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
      const { hash } = document.location;
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
    <>
      <div className="flex items-center min-h-screen flex-col bg-kaki">

        <DesktopTopNavigation user={user} isAuthLoading={isAuthLoading} signOut={signOut} />
        <MobileTopNavigation onMenuIconClick={() => setMenuOpen(true)} />

        <div className="phone-width bg-white shadow-xl min-h-screen md:mt-6">
          <DesktopLowerNavigation />
          <div className="md:px-16 mt-20 md:mt-0 overflow-hidden">
            {children}
          </div>
          <Footer />
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
        <Route path="/filtered-list-frame">
          <FilteredListFrame />
        </Route>
        <Route path="/offer-help/:id">
          <Page>
            <OfferHelp />
          </Page>
        </Route>
        <Route path="/signup/:returnUrl">
          <Page>
            <Signup />
          </Page>
        </Route>
        <Route path="/signup">
          <Page>
            <Signup />
          </Page>
        </Route>
        <Route path="/signin/:returnUrl">
          <Page>
            <Signin />
          </Page>
        </Route>
        <Route path="/signin">
          <Page>
            <Signin />
          </Page>
        </Route>
        <Route path="/verify-email">
          <Page>
            <VerifyEmail />
          </Page>
        </Route>
        <Route path="/ask-for-help">
          <Page>
            <AskForHelp />
          </Page>
        </Route>
        <Route path="/dashboard">
          <Page>
            <Dashboard />
          </Page>
        </Route>
        <Route path="/faq">
          <Page>
            <FAQ />
          </Page>
        </Route>
        <Route path="/security-tips">
          <Page>
            <Security />
          </Page>
        </Route>
        <Route path="/impressum">
          <Page>
            <Imprint />
          </Page>
        </Route>
        <Route path="/overview">
          <Page>
            <Overview />
          </Page>
        </Route>
        <Route path="/success">
          <Page>
            <Success />
          </Page>
        </Route>
        <Route path="/success-offer">
          <Page>
            <SuccessOffer />
          </Page>
        </Route>
        <Route path="/dsgvo">
          <Page>
            <DSGVO />
          </Page>
        </Route>
        <Route path={['/press', '/presse']}>
          <Page>
            <Press />
          </Page>
        </Route>
        <Route path="/notify-me">
          <Page>
            <NotifyMe />
          </Page>
        </Route>
        <Route path="/complete-offer-help">
          <Page>
            <CompleteOfferHelp />
          </Page>
        </Route>
        <Route path="/handle-email-action">
          <Page>
            <HandleEmailAction />
          </Page>
        </Route>
        <Route exact path="/">
          <Page>
            <Main />
          </Page>
        </Route>
        <Route path="*">
          <Page>
            <NotFound />
          </Page>
        </Route>
      </Switch>
    </Router>
  );
}
