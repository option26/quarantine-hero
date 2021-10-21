import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import fb from '../firebase';

import FilteredListFrame from '../views/FilteredListFrame';
import OfferHelp from '../views/OfferHelp';
import Signup from '../views/Signup';
import Signin from '../views/Signin';
import VerifyEmail from '../views/VerifyEmail';
import AskForHelp from '../views/AskForHelp';
import Dashboard from '../views/Dashboard';
import FAQ from '../views/FAQ';
import Security from '../views/Security';
import Overview from '../views/Overview';
import Success from '../views/Success';
import SuccessOffer from '../views/SuccessOffer';
import Press from '../views/Press';
import NotifyMe from '../views/NotifyMe';
import CompleteNotification from '../views/CompleteNotification';
import Main from '../views/Main';
import NotFound from '../views/NotFound';
import Page from './Page';
import HandleEmailAction from '../views/HandleEmailAction';
import PrivacyPolicy from '../views/PrivacyPolicy';
import Imprint from '../views/Imprint';
import Partners from '../views/Partners';

function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    fb.analytics.logEvent('page_view', { page_path: location.pathname });
  }, [location]);
}

export default function Routes() {
  // if cookies are consented we will log an event to
  // firebase every time that the current path changes
  usePageViews();

  return (
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
      <Route path="/privacy-policy">
        <Page>
          <PrivacyPolicy />
        </Page>
      </Route>
      <Route path={['/press', '/presse']}>
        <Page>
          <Press />
        </Page>
      </Route>
      <Route path="/partners">
        <Page>
          <Partners />
        </Page>
      </Route>
      <Route path="/notify-me">
        <Page>
          <NotifyMe />
        </Page>
      </Route>
      <Route path="/complete-notification">
        <Page>
          <CompleteNotification />
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
      <Route exact path="/test-sentry">
        <button
          className="btn border-black p-2 bg-secondary rounded m-4 shadow"
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log('Capturing exception');
            // eslint-disable-next-line no-console
            console.log(process.env.REACT_APP_SENTRY_RELEASE);
            Sentry.captureException('captured test exception');
          }}
        >
          Capture Exception
        </button>
      </Route>
      <Route path="*">
        <Page>
          <NotFound />
        </Page>
      </Route>
    </Switch>
  );
}
