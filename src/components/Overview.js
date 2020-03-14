import React, { useState, useEffect } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import PlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import Entry from './Entry';
import LocationInput from './LocationInput';
import FilteredList from './FilteredList';
import Footer from './Footer';

export default function AskForHelp () {

  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([]);
  const [searchCompleted, setSearchCompleted] = useState(false);

  // Create a Firestore reference
  const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
  const geocollection = geofirestore.collection('ask-for-help');

  const handleSelect = address => {
    setLocation(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(coordinates =>  {
        const query = geocollection.near({ center: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng), radius: 30 });
        query.get().then((value) => {
          // All GeoDocument returned by GeoQuery, like the GeoDocument added above
          setEntries(value.docs.map(doc => ({...doc.data(), id: doc.id})));
          setSearchCompleted(true);
        });
      })
      .catch(error => console.error('Error', error));
  };

  return (<div className="p-4">
      <h1 className="py-4 pt-10 font-teaser">Aktuelle Anfragen</h1>
      <div className="font-open-sans">
        Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
      </div>
      <div className="py-3">
        <FilteredList />
      </div>
      <Footer />
    </div>
  );
}

