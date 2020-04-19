import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { GeoFirestore } from 'geofirestore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import { isMapsApiEnabled } from '../featureFlags';
import { getGeodataForPlace, getGeodataForString, getLatLng } from '../services/GeoService';
import Loader from '../components/loader/Loader';

export default function CompleteOfferHelp() {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [error, setError] = useState(undefined);

  const createOfferHelp = async (loc, placeId, email) => {
    const geofirestore = new GeoFirestore(fb.store);
    const offerHelpCollection = geofirestore.collection('/offer-help');
    let lat = 0;
    let lng = 0;
    let plz = loc;
    if (isMapsApiEnabled) {
      let results;
      if (placeId) {
        results = await getGeodataForPlace(placeId);
      } else {
        results = await getGeodataForString(loc);
      }
      const plzComponent = results[0].address_components.find((c) => c.types.includes('postal_code'));
      if (plzComponent) plz = plzComponent.short_name;
      const coordinates = getLatLng(results[0]);
      lat = coordinates.lat;
      lng = coordinates.lng;
    }

    await offerHelpCollection.add({
      email,
      location: loc,
      plz,
      uid: firebase.auth().currentUser.uid,
      timestamp: Date.now(),
      coordinates: new fb.app.firestore.GeoPoint(lat, lng),
    });

    fb.analytics.logEvent('success_subscribe_region_confirmation');
  };

  useEffect(() => {
    async function completeSignup() {
      if (!firebase.auth().isSignInWithEmailLink(window.location.href)) {
        setLoading(false);
        setError(true);
        return;
      }

      const emailRegex = window.location.href.match(/email=([^&]*)/);
      let email;
      if (emailRegex && emailRegex.length > 1 && emailRegex[1]) {
        // eslint-disable-next-line prefer-destructuring
        email = emailRegex[1];
      } else {
        // TODO: Use nice input for this!
        // We only end up here if there is no email set in the localStorage of the users browser
        // this might happen e.g. if the user signs up on his desktop pc and clicks the confirmation
        // link in his mobile phones email client.
        // eslint-disable-next-line no-alert
        email = window.prompt(t('views.completeOfferHelp.mailYouRegistered'));
      }

      try {
        await fb.auth.signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');

        const urlParams = new URLSearchParams(window.location.hash);
        const loc = urlParams.get('#/complete-offer-help?location');
        const placeId = urlParams.get('#/complete-offer-help?placeId');

        setLocation(loc);
        createOfferHelp(loc, placeId, email);
      } catch (err) {
        setError(err);
      }

      setLoading(false);
    }

    completeSignup();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4">
      {isLoading && <Loader />}
      {!isLoading && error && (
        <>
          <h1 className="text-2xl font-exo2 mt-10 mb-6">{t('views.completeOfferHelp.anErrorOccured')}</h1>
          <p>
            {t('views.completeOfferHelp.verificationError')}
          </p>
          <div className="flex justify-center flex-col items-center mb-8">
            <img className="h-48 w-48 my-10" src={require('../assets/error.svg')} alt="" />
            <Link className="btn-green mt-10" to="/notify-me">{t('views.completeOfferHelp.tryAgain')}</Link>
          </div>
        </>
      )}
      {!isLoading && !error && (
        <>
          <h1 className="text-2xl font-exo2 mt-10 mb-6">{t('views.completeOfferHelp.youAreHero')}</h1>
          <p>
            {t('views.completeOfferHelp.mailVerified')}
            {' '}
            <span className="text-secondary">{location}</span>
            {' '}
            {t('views.completeOfferHelp.needsHelp')}
          </p>
          <div className="flex justify-center flex-col items-center mb-8">
            <img className="h-48 w-48 my-10" src={require('../assets/success.svg')} alt="" />
            <Link className="btn-green mt-10" to="/dashboard">{t('views.completeOfferHelp.toYourOverview')}</Link>
          </div>
        </>
      )}
    </div>
  );
}
