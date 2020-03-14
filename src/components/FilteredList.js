import React, { useState, useEffect } from 'react';
import fb from '../firebase';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import Entry from './Entry';
import LocationInput from './LocationInput';
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebaseApp from "firebase/app";
import 'firebase/auth';

const firebaseAppAuth = firebaseApp.auth();

const NotifyMe = (props) => {

  const {location} = props;

  const [email, setEmail] = useState('');

  const geofirestore = new GeoFirestore(fb.store);
  const offerHelpCollection = geofirestore.collection('/offer-help');

  const handleClick = async () => {

    await firebaseApp.auth().sendSignInLinkToEmail(email, {
      url: 'http://localhost:3000/#/complete-offer-help',
      handleCodeInApp: true,
    });

    window.localStorage.setItem('emailForSignIn', email);

    await offerHelpCollection.add({
      // uid: fb.auth.currentUser.uid,
      timestamp: Date.now(),
      email,
      // The coordinates field must be a GeoPoint!
      coordinates: new fb.app.firestore.GeoPoint(10, 10),
      location,
    });
  };

  return (
    <div>
      <div className="mb-2 mt-4">In {location} gibt es aktuell keine Anfragen. Du kannst von uns automatisch
        benachrichtigt werden wenn
        jemand in deiner Nähe Hilfe braucht.
      </div>
      <input className="px-2 py-2 w-full rounded border-2" type="email" placeholder="Deine Emailadresse"
             onChange={(e) => setEmail(e.target.value)} value={email} required="required"></input>
      <button style={{color: 'white'}} className="mt-4 mb-16 btn text-white btn-primary bg-primary"
              onClick={handleClick}>
        Benachrichtigen, wenn jemand in meiner Nähe Hilfe braucht
      </button>
    </div>
  );
};

export default function FilteredList () {

  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([{
    id: "placeholder-id"
  }]);
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
      <div className="py-3 w-full">
        {entries.length === 0 ? (!searchCompleted || location.length === 0 ?
          <span>Bitte gib deinen Standort ein.</span> : <NotifyMe location={location}/>) : entries.map(entry => (
          <Entry key={entry.id} {...entry}/>))}
      </div>
    </div>
  );
}

