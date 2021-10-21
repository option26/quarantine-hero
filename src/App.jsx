import { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import 'firebase/auth';
import Routes from './components/Routes';
import Loader from './components/loader/Loader';
import './i18n';
import CookieConsent from './util/CookieConsent';
import Sentry from './util/Sentry'; // Internalization

export default function App() {
  // we use Suspense for loading of i18next

  // <Router><Routes /><Router> is nested because this
  // way we can use a hook inside the <Routes /> component
  // that already has the context available from Router

  return (
    <Suspense fallback={<Loader />}>
      <CookieConsent>
        <Sentry />
        <Router>
          <Routes />
        </Router>
      </CookieConsent>
    </Suspense>
  );
}
