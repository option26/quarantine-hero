import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as Sentry from '@sentry/browser';
import { GeoFirestore } from 'geofirestore';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import { isMapsApiEnabled } from '../featureFlags';
import { getGeodataForPlace, getGeodataForString, getLatLng } from '../services/GeoService';
import Loader from '../components/loader/Loader';

export default function CompleteOfferHelp() {
  const { t } = useTranslation();
  const windowLocation = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [error, setError] = useState(false);

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

    // Create will work but subsequent updates will fail. This is to prevent duplicates
    await offerHelpCollection.doc(`${email}_${plz}`).set({
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
    async function completeOfferHelp() {
      const urlParams = new URLSearchParams(windowLocation.search);
      const loc = urlParams.get('location');
      const email = urlParams.get('email');
      const placeId = urlParams.get('placeId');

      setLocation(loc);
      try {
        await createOfferHelp(loc, placeId, email);
      } catch (err) {
        Sentry.captureException(err);
        setError(true);
      }
      setLoading(false);
    }

    completeOfferHelp();
  }, [windowLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Loader waitOn={!isLoading}>
      <div className="p-4">
        {error
          ? (
            <>
              <h1 className="text-2xl font-exo2 mt-10 mb-6">{t('views.completeOfferHelp.anErrorOccured')}</h1>
              <p>
                {t('views.completeOfferHelp.error')}
              </p>
              <div className="flex justify-center flex-col items-center mb-8">
                <img className="h-48 w-48 my-10" src={require('../assets/error.svg')} alt="" />
                <Link className="btn-green mt-10" to="/notify-me">{t('views.completeOfferHelp.tryAgain')}</Link>
              </div>
            </>
          ) : (
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
    </Loader>
  );
}
