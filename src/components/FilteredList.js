import React, {useState, useEffect} from 'react';
import fb from '../firebase';
import {GeoFirestore} from 'geofirestore';
import {getLatLng, geocodeByAddress} from 'react-places-autocomplete';
import Entry from './Entry';
import LocationInput from './LocationInput';
import {isMapsApiEnabled} from '../featureFlags.js';
import {Link} from 'react-router-dom';
import Pagination from './Pagination';

export default function FilteredList() {

  const pageSize = 10

  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([
    {
      id: 'placeholder-id',
    }]);
  const [filteredEntries, setFilteredEntries] = useState([
    {
      id: 'placeholder-id',
    }]);

  const [firstEntry, setFirstEntry] = useState(undefined);
  const [lastEntry, setLastEntry] = useState(undefined);

  const collection = fb.store.collection('ask-for-help');
  const baseQuery = collection.orderBy('d.timestamp', 'desc');
  var query = baseQuery.limit(pageSize);

  const getUserData = () => {
    query.get().then(value => {
      if(value.docs.length < 1) return;
      if(value.docs.length < pageSize) {
        //TODO: Differentiate between last and first page
        //query = 
      }

      setFirstEntry(value.docs[0]);
      setLastEntry(value.docs[value.docs.length - 1]);

      setEntries(value.docs.map(doc => ({...doc.data().d, id: doc.id})));
      setFilteredEntries(value.docs.map(doc => ({ ...doc.data().d, id: doc.id })));
    });
  };

  useEffect(getUserData, []);

  // Create a Firestore reference
  const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
  const geocollection = geofirestore.collection('ask-for-help');

  const nextPage = () => {
    query = baseQuery.limit(pageSize).startAfter(lastEntry);
    getUserData();
  }

  const prevPage = () => {
    query = baseQuery.limitToLast(pageSize).endBefore(firstEntry);
    getUserData();
  }

  const handleChange = address => {
    setLocation(address);
    if (!isMapsApiEnabled) {
      setFilteredEntries(entries.filter(entry => String(entry.plz).indexOf(address) === 0));
    }
  };

  const handleSelect = address => {
    setLocation(address);
    if (isMapsApiEnabled) {
      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(coordinates => {
          const query = geocollection.near({ center: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng), radius: 30 });
          query.get().then((value) => {
            // All GeoDocument returned by GeoQuery, like the GeoDocument added above
            setEntries(value.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            setFilteredEntries(value.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          });
        })
        .catch(error => console.error('Error', error));
    }
  };

  const NoHelpNeeded = (props) => {
    return <div className="w-full text-center my-10">In {location} wird gerade aktuell keine Hilfe gebraucht!</div>
  };

  return (<div>
      <div className="pt-3">
        <LocationInput onChange={handleChange} value={location} onSelect={handleSelect}/>
      </div>
      <div className="py-3 w-full">
        <div className="my-3 w-full">
          <Link to='/notify-me' className="btn-green-secondary my-3 mb-6 w-full block" onClick={() => fb.analytics.logEvent('button_subscribe_region')}>
            Benachrichtige mich wenn jemand in {location && location !== '' ? location : 'meiner Nähe'} Hilfe braucht!</Link>
        </div>
        {entries.length === 0 ? <NoHelpNeeded /> : filteredEntries.map(
          entry => (
            <Entry key={entry.id} {...entry}/>))}
        <div className="flex justify-center pt-3">
          <Pagination onPrevPage={prevPage} onNextPage={nextPage} />
        </div>
      </div>
    </div>
  );
}

