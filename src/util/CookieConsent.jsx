import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CookieConsentContext = React.createContext(null);

function CookieConsentBanner({ accept, reject }) {
  const { t } = useTranslation();
  return (
    <div
      style={{ zIndex: 501 }}
      className="fixed left-0 bottom-0 w-full bg-gray-900 p-4 text-white font-exo2 flex flex-no-wrap items-center space-between flex-row"
    >
      <div className="flex-grow">{t('App.usesCookies')}</div>
      <button
        type="button"
        className="bg-primary p-2 rounded ml-2 font-open-sans flex items-center justify-center"
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
  );
}

export default function CookieConsent({ children }) {
  const [cookiesConsented, setCookiesConsented] = useState(null);

  const acceptCookies = () => {
    window.localStorage.setItem('qh-cookies-accepted', 'true');
    setCookiesConsented(true);
  };
  const rejectCookies = () => {
    window.localStorage.setItem('qh-cookies-accepted', 'false');
    setCookiesConsented(false);
  };

  useEffect(() => {
    const value = window.localStorage.getItem('qh-cookies-accepted');
    const isAccepted = typeof value === 'string' ? value === 'true' : null;
    setCookiesConsented(isAccepted);
  }, []);

  return (
    <CookieConsentContext.Provider value={cookiesConsented}>
      {cookiesConsented === null && <CookieConsentBanner accept={acceptCookies} reject={rejectCookies} />}
      {children}
    </CookieConsentContext.Provider>
  );
}
