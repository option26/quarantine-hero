import React, { useState, useEffect } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import Entry from './Entry';
import LocationInput from './LocationInput';

export default function FilteredList () {

  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([{}]);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const collection = fb.store.collection('ask-for-help');
  const query = collection.orderBy('d.timestamp', 'desc').limit(10);

  const getUserData = () => {
    query.get().then(value => {
      setEntries(value.docs.map(doc => ({ ...doc.data().d, id: doc.id })));
    });
  };

  useEffect(getUserData, []);

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
          console.log(value.docs)
          setEntries(value.docs.map(doc => ({...doc.data(), id: doc.id})));
          setSearchCompleted(true);
        });
      })
      .catch(error => console.error('Error', error));
  };

  return (<div>
      <div className="py-3">
        <LocationInput onChange={setLocation} value={location} onSelect={handleSelect} />
      </div>
      <div className="py-3">
        {entries.length === 0 ? (!searchCompleted || location.length === 0 ? <span>Bitte gib deinen Standort ein.</span> : <span>Bei in der Nähe hat aktuell Niemand Hilfe angefragt.</span>) : entries.map(entry => (<Entry key={entry.id} {...entry}/>))}
      </div>
    </div>
  );
}

