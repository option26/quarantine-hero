import React, { useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import LocationInput from '../components/LocationInput';
import { isMapsApiEnabled } from '../featureFlags';
import { getGeodataForPlace, getLatLng } from '../services/GeoService';
import { useEmailVerified } from '../util/emailVerified';

export default function AskForHelp() {
  const { t } = useTranslation();

  const [user, isAuthLoading] = useAuthState(fb.auth);
  const [emailVerified, emailVerifiedLoading] = useEmailVerified(fb.auth);

  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState(undefined);
  const history = useHistory();

  const handleSubmit = async (e) => {
    // Prevent page reload
    e.preventDefault();

    let lat = 0;
    let lng = 0;
    let plz = location;

    if (isMapsApiEnabled) {
      if (!placeId) {
        throw new Error('PlaceId was undefined in ask-for-help');
      }
      const result = await getGeodataForPlace(placeId);

      plz = result.plz;
      const coordinates = getLatLng(result);
      lat = coordinates.lat;
      lng = coordinates.lng;
    }

    // Create a GeoFirestore reference
    const geofirestore = new GeoFirestore(fb.store);

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('ask-for-help');

    // Add a GeoDocument to a GeoCollection
    await geocollection.add({
      request,
      uid: user.uid,
      timestamp: Date.now(),
      // The coordinates field must be a GeoPoint!
      coordinates: new fb.app.firestore.GeoPoint(lat, lng),
      location,
      plz,
    });

    return history.push('/success');
  };

  const handleChange = (address) => {
    setLocation(address);
  };

  const handleSelect = (address, pId) => {
    setLocation(address);
    setPlaceId(pId);
  };

  if (!user || (!isAuthLoading && (!user || !user.email))) {
    return <Redirect to="/signin/ask-for-help" />;
  }

  if (!emailVerifiedLoading && !emailVerified) {
    return <Redirect to="/verify-email" />;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="font-teaser py-4 pt-10">{t('views.askForHelp.createRequest')}</h1>
      <div className="font-open-sans">
        {t('views.askForHelp.whenSomeoneWantsToHelpExplanation')}
        <div className=" w-full p-4 bg-kaki mt-4">
          <strong>{t('views.askForHelp.noRequestsHere')}</strong>
          {' '}
          {t('views.askForHelp.ifYouWantToGetNotified')}
          {' '}
          <Link to="/notify-me" className="text-secondary hover:underline">
            {t('views.askForHelp.thisFunction')}
          </Link>
          .
        </div>
      </div>
      <div className="py-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          {t('views.askForHelp.whereAreYou')}
        </label>
        <LocationInput required value={location} onChange={handleChange} onSelect={handleSelect} />
      </div>


      <div className="py-3">
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            {t('views.askForHelp.whatCanWeDo')}
          </label>
          <textarea
            className="border leading-tight rounded py-2 px-3 pb-20 w-full input-focus focus:outline-none"
            data-cy="ask-for-help-text-input"
            required="required"
            placeholder={t('views.askForHelp.whatCanWeDo')}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>
        <div className="mt-4 mb-6 w-full text-gray-700">
          {t('views.askForHelp.requestIsPublic')}
        </div>
        <div className="mt-4 w-full flex justify-end">
          <button type="submit" data-cy="ask-for-help-submit" className="btn-green w-full md:w-1/3">{t('views.askForHelp.askNow')}</button>
        </div>
      </div>
    </form>
  );
}
