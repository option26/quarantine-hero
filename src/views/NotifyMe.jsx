import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import LocationInput from '../components/LocationInput';
import Footer from '../components/Footer';
import MailInput from '../components/MailInput';
import { baseUrl } from '../appConfig';

export default function NotifyMe() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [signInLinkSent, setSignInLinkSent] = useState(false);
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState('');

  const handleSubmit = async (e) => {
    // Prevent page reload
    e.preventDefault();

    window.localStorage.setItem('emailForSignIn', email);

    try {
      await fb.auth.sendSignInLinkToEmail(email, {
        url: `${baseUrl}/#/complete-offer-help?location=${location}&placeId=${placeId}&email=${email}`,
        handleCodeInApp: true,
      });
      fb.analytics.logEvent('success_subscribe_region');

      setSignInLinkSent(true);
    } catch (error) {
      // TODO: handle error
    }
  };

  const handleChange = (address) => {
    setLocation(address);
  };

  const handleSelect = (address, pId) => {
    setLocation(address);
    setPlaceId(pId);
  };

  if (signInLinkSent) {
    return (
      <div className="p-4">
        <div className="font-teaser my-6">
          {t('views.notifyMe.beNotified')}
        </div>
        <div className="border bg-secondary px-4 py-2 rounded text-white flex flex-row items-center border">
          {t('views.notifyMe.emailSent', { location })}
        </div>
      </div>

    );
  }

  return (
    <div className="p-4">
      <div className="font-teaser my-6">
        {t('views.notifyMe.beNotified')}
      </div>
      <form onSubmit={handleSubmit}>
        <LocationInput required onChange={handleChange} value={location} onSelect={handleSelect} />
        <MailInput className="input-focus my-6" placeholder={t('views.notifyMe.yourMail')} onSetEmail={setEmail} defaultValue={email} />
        <button className="mt-6 btn-green w-full disabled:opacity-75 disabled:cursor-not-allowed" type="submit">
          {t(
            'views.notifyMe.notifyMe',
            { location: (location && location !== '' ? `der Nähe von ${location}` : 'meiner Nähe') },
          )}
        </button>
      </form>
      <Footer />
    </div>
  );
}
