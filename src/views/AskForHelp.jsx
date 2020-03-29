import React, { useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import LocationInput from '../components/LocationInput';
import Footer from '../components/Footer';
import { isMapsApiEnabled } from '../featureFlags';
import { getGeodataForPlace, getGeodataForString, getLatLng } from '../services/GeoService';

export default function AskForHelp() {
  const { t } = useTranslation();

  const [user, isAuthLoading] = useAuthState(fb.auth);
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
      let results;
      if (placeId) {
        results = await getGeodataForPlace(placeId);
      } else {
        results = await getGeodataForString(location);
      }
      const plzComponent = results[0].address_components.find((c) => c.types.includes('postal_code'));
      if (plzComponent) plz = plzComponent.short_name;
      const coordinates = getLatLng(results[0]);
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

  if (!isAuthLoading && (!user || !user.email)) {
    return <Redirect to="/signin/ask-for-help" />;
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
