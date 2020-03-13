import React, { useState, useEffect } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import PlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import Entry from './Entry';

export default function AskForHelp () {

  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([]);

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
        });
      })
      .catch(error => console.error('Error', error));
  };

  return (<div>
      <h1 className="text-4xl py-4 pt-10">Hilfe Anbieten</h1>

      <div className="py-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Wo bist du?
        </label>
        <PlacesAutocomplete onChange={setLocation} value={location} onSelect={handleSelect}  searchOptions={{
          types: [ "(regions)"]
        }}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Deine Stadt...',
                  className: 'location-search-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <div className="py-3">
        {entries.length === 0 ? (location.length === 0 ? <span>Bitte gib deinen Standort ein.</span> : <span>Bei in der Nähe hat aktuell Niemand Hilfe angefragt.</span>) : entries.map(entry => (<Entry {...entry}/>))}
      </div>
    </div>
  );
}

