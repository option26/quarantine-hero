import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';

export const CookieConsentContext = React.createContext(null);

function CookieConsentBanner({ accept, reject }) {
  const { t } = useTranslation();

  function goToLink() {
    window.location.href = `/#${t('App.usesCookies.url')}`;
  }

  return (
    <div
      style={{ zIndex: 501 }}
      className="fixed left-0 bottom-0 w-full bg-gray-900 md:pb-0 pb-4 px-4 text-white font-exo2 flex flex-wrap md:flex-no-wrap items-center space-between justify-end flex-row"
    >
      <div className="flex-grow mt-4 md:my-4">
        {t('App.usesCookies.preLink')}
        <button type="button" onClick={goToLink} className="text-secondary hover:underline">
          {' '}
          {t('App.usesCookies.link')}
        </button>
        {t('App.usesCookies.postLink')}
      </div>
      <div className="flex my-2">
        <button
          type="button"
          className="bg-primary p-2 rounded font-open-sans flex items-center justify-center"
          onClick={reject}
        >
          {t('App.rejectCookies')}
        </button>
        <button
          type="button"
          className="bg-secondary p-2 rounded ml-2 font-open-sans flex items-center justify-center"
          onClick={accept}
        >
          {t('App.acceptCookies')}
        </button>
      </div>
    </div>
  );
}

export default function CookieConsent({ children }) {
  const [cookiesConsented, setCookiesConsented] = useState(null);

  const acceptCookies = () => {
    window.localStorage.setItem('qh-cookies-accepted', 'true');
    setCookiesConsentAndAnalytics(true);
  };
  const rejectCookies = () => {
    window.localStorage.setItem('qh-cookies-accepted', 'false');
    setCookiesConsentAndAnalytics(false);
  };

  const setCookiesConsentAndAnalytics = (state) => {
    setCookiesConsented(state);
    fb.setAnalytics(state);
  }

  useEffect(() => {
    const value = window.localStorage.getItem('qh-cookies-accepted');
    const isAccepted = typeof value === 'string' ? value === 'true' : null;
    setCookiesConsentAndAnalytics(isAccepted);
  }, []);

  return (
    <CookieConsentContext.Provider value={cookiesConsented}>
      {cookiesConsented === null && <CookieConsentBanner accept={acceptCookies} reject={rejectCookies} />}
      {children}
    </CookieConsentContext.Provider>
  );
}
