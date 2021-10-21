import { useContext, useEffect } from 'react';
import * as ActualSentryFromSDK from '@sentry/browser';
import { CookieConsentContext } from './CookieConsent';

export default function Sentry() {
  const cookiesConsented = useContext(CookieConsentContext);

  useEffect(() => {
    if (cookiesConsented) {
      ActualSentryFromSDK.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: process.env.REACT_APP_ENV,
        release: process.env.REACT_APP_SENTRY_RELEASE,
      });
    }
  }, [cookiesConsented]);

  return <></>;
}
