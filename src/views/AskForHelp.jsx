import React, { useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import LocationInput from '../components/LocationInput';
import Footer from '../components/Footer';
import { isMapsApiEnabled } from '../featureFlags';

export default function AskForHelp() {
  const { t } = useTranslation();

  const [user, isAuthLoading] = useAuthState(fb.auth);
  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoodinates] = useState({
    lat: null,
    lng: null,
  });
  const history = useHistory();
  // Create a Firestore reference

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a GeoFirestore reference
    const geofirestore = new GeoFirestore(fb.store);

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('ask-for-help');

    // Add a GeoDocument to a GeoCollection
    geocollection.add({
      request,
      uid: user.uid,
      timestamp: Date.now(),
      // The coordinates field must be a GeoPoint!
      coordinates: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng),
      location,
      plz: location,
    });

    return history.push('/success');
  };

  const handleChange = (address) => {
    setLocation(address);
    if (!isMapsApiEnabled) {
      setCoodinates({ lat: 0, lng: 0 });
    }
  };

  const handleSelect = (address) => {
    setLocation(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(setCoodinates)
      // eslint-disable-next-line no-console
      .catch((error) => console.error('Error', error));
  };

  if (!isAuthLoading && (!user || !user.email)) {
    return <Redirect to="/signup" />;
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
            required="required"
            placeholder={t('views.askForHelp.whatCanWeDo')}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>
        <div className="mt-4 mb-6 w-full text-gray-700">
          {t('views.askForHelp.requestIsPublic')}
        </div>
        <div className="mt-4 w-full flex justify-end">
          <button type="submit" className="btn-green w-full md:w-1/3">{t('views.askForHelp.askNow')}</button>
        </div>
      </div>
      <Footer />
    </form>
  );
}
