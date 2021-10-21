import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useLocation, useHistory } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import fb from '../firebase';
import LocationInput from '../components/LocationInput';
import MailInput from '../components/MailInput';
import { baseUrl } from '../appConfig';
import useQuery from '../util/useQuery';
import { HelpNeededIcon } from '../util/Icons';

export default function NotifyMe() {
  const { t } = useTranslation();
  const [user] = useAuthState(fb.auth);

  const { location: queryLocation, placeId: queryPid } = useQuery();

  const [email, setEmail] = useState((user && user.email) || '');
  const [signInLinkSent, setSignInLinkSent] = useState(false);
  const [location, setLocation] = useState(queryLocation || '');
  const [placeId, setPlaceId] = useState(queryPid || '');
  const history = useHistory();
  const windowLocation = useLocation();

  const handleSubmit = async (e) => {
    // Prevent page reload
    e.preventDefault();

    try {
      await fb.auth.sendSignInLinkToEmail(email, {
        url: `${baseUrl}/#/complete-notification?location=${location}&placeId=${placeId}`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem('emailForSignIn', email);
      fb.analytics.logEvent('success_subscribe_region');

      setSignInLinkSent(true);
    } catch (error) {
      Sentry.captureException(error);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => history.replace(windowLocation.pathname), []);

  if (signInLinkSent) {
    return (
      <div className="p-4">
        <div className="font-teaser my-6">
          {t('views.notifyMe.finalizeNotification')}
        </div>
        <div className="px-4 py-2 font-semibold rounded text-secondary bg-light-green flex items-center">
          {t('views.notifyMe.emailSent')}
        </div>
        <div className="mt-6 flex flex-col items-center">
          <p className="font-light text-center">{t('views.notifyMe.willNotify')}</p>
          <img className="mt-4" src={HelpNeededIcon} alt="" />
          <p className="text-xl text-primary font-exo2 font-semibold">{location}</p>
        </div>
        <div className="flex mt-10 justify-center">
          <Link className="btn-green" to="/overview">{t('views.notifyMe.findRequests')}</Link>
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
        <LocationInput required onChange={handleChange} value={location} onSelect={handleSelect} isInitiallyValid={!!placeId} />
        <MailInput className="input-focus my-6" placeholder={t('views.notifyMe.yourMail')} onChange={setEmail} defaultValue={email} />
        <button className="mt-6 btn-green w-full disabled:opacity-75 disabled:cursor-not-allowed" type="submit">
          {t(
            'views.notifyMe.notifyMe',
            { location: (location && location !== '' ? `der Nähe von ${location}` : 'meiner Nähe') },
          )}
        </button>
      </form>
    </div>
  );
}
