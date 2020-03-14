import React, { useState } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { Redirect, useHistory } from 'react-router-dom';
import LocationInput from './LocationInput';
import Footer from './Footer';

export default function AskForHelp () {
  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoodinates] = useState({
    lat: null,
    lng: null,
  });
  const history = useHistory();
  // Create a Firestore reference

  const handleSubmit = e => {
    e.preventDefault();
    // Create a GeoFirestore reference
    const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
    const geocollection = geofirestore.collection('ask-for-help');

// Add a GeoDocument to a GeoCollection
    geocollection.add({
      request,
      uid: fb.auth.currentUser.uid,
      timestamp: Date.now(),
      // The coordinates field must be a GeoPoint!
      coordinates: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng),
      location,
    });

    return history.push('/success');
  };

  const handleSelect = address => {
    setLocation(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(setCoodinates)
      .catch(error => console.error('Error', error));
  };

  if(!fb.auth.currentUser || !fb.auth.currentUser.email) {
    return <Redirect to="/signup"/>;
  }


  return (<form onSubmit={handleSubmit} className="p-4">
      <h1 className="font-teaser py-4 pt-10">Erstelle eine Anfrage um Helden um Hilfe zu bitten.</h1>
      <div className="font-open-sans">
        Wenn dir jemand helfen möchte, kann er dich über diese Website kontaktieren und wir leiten die Kontaktanfrage automatisch an deine E-Mail.
        Alles weitere könnt ihr per E-Mail besprechen.
      </div>
      <div className="py-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Wo bist du?
        </label>
        <LocationInput value={location} onChange={setLocation} onSelect={handleSelect}/>
      </div>


      <div className="py-3">
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Wobei kann man dir helfen?
          </label>
          <textarea className="border leading-tight rounded py-2 px-3 pb-20 w-full input-focus focus:outline-none"
                    required="required" placeholder="Wobei kann man dir helfen?" onChange={e => setRequest(e.target.value)}/>
        </div>
        <div className="mt-4 mb-6 w-full text-gray-700">
          Sobald du deine Anfrage absendest ist diese öffentlich für andere einsehbar. Deine E-Mail-Adresse ist für andere nicht einsehbar.
        </div>
        <div className="mt-4 w-full flex justify-end">
          <button type="submit" className="btn-green w-full md:w-1/3">Jetzt um Hilfe bitten</button>
        </div>
      </div>
      <Footer />
    </form>
  );
}

