import React, { useState, useEffect } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import PlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { useHistory } from 'react-router-dom';

export default function AskForHelp () {

  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoodinates] = useState({
    lat: null,
    lng: null
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
      location
    });

    return history.push('/success')
  };

  const handleSelect = address => {
    setLocation(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(setCoodinates)
      .catch(error => console.error('Error', error));
  };

  useEffect(() => {
    console.log(location);
  });

  return (<form style={{ maxWidth: '1000px', margin: 'auto' }} onSubmit={handleSubmit}>
      <h1 className="text-4xl py-4 pt-10">Um Unterstützung bitten</h1>

      <div className="py-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Wo bist du?
        </label>
        <PlacesAutocomplete onChange={setLocation} value={location} onSelect={handleSelect} searchOptions={{
         types: [ "(regions)"],
          componentRestrictions: {country: ["de","at","ch"]},
        }}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input required="required"
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
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Wobei kann man dir helfen?
          </label>
          <textarea className="border leading-tight rounded border-gray-400 py-2 px-3 pb-20 w-full"
                    required="required" placeholder="Deine Anfrage hier" onChange={e => setRequest(e.target.value)}/>
        </div>
        <div className="mt-8 mb-10 w-full text-gray-700">
          Sobald du deine Anfrage absendest ist diese öffentlich für andere einsehbar. Deine Email-Adresse ist
          für andere nicht einsehbar. <br/>
          Wenn dir jemand helfen möchte, kann er dich über diese Website kontaktieren und wir leiten die
          Kontaktanfrage automatisch an deine Email weiter. Ab dann könnt ihr euch unter euch absprechen.
        </div>
        <div className="mt-4 w-full">
          <button type="submit" className="btn-primary">Jetzt um Hilfe bitten</button>
        </div>
      </div>
    </form>
  );
}

