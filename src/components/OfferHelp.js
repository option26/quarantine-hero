import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import { useParams } from 'react-router-dom';
import { GeoFirestore } from 'geofirestore';
import Entry from "./Entry";

export default function OfferHelp () {
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [entry, setEntry] = useState({
    id: null,
    location: null,
    request: null,
    timestamp: null,
  });

  let { id } = useParams();

// Create a GeoFirestore reference
  const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
  const geocollection = geofirestore.collection('/ask-for-help');

  const getUserData = () => {
// Create a Firestore reference

// Add a GeoDocument to a GeoCollection
    geocollection.doc(id).get().then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        setEntry(doc.data());
      }
    });
    /*
    // Create a GeoQuery based on a location
        const query = geocollection.near({ center: new fb.app.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

    // Get query (as Promise)
        query.get().then((value) => {
          // All GeoDocument returned by GeoQuery, like the GeoDocument added above
          //setEntry(value.docs[0].data());
        });*/
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const collection = fb.store.collection(`/ask-for-help/${id}/offer-help`);

    collection.add({
      answer,
      email,
      timestamp: Date.now(),
    });
  };

  useEffect(getUserData, []);

  return (<form onSubmit={handleSubmit}>
      <div className="mt-4 p-1">
        <label className="text-base text-gray-700">Anfrage</label>
        <Entry {...entry} showFullText/>
      </div>
      <div className="mt-4 p-1 w-full">
        <label className="text-base text-gray-700">Deine Antwort</label>
        <textarea className="border rounded border-gray-400 p-4 text-xl w-full" onChange={e => setAnswer(e.target.value)}
                  placeholder="Ich kann helfen!"/>
      </div>
      <div className="mt-4 p-1 w-full">
        <label className="text-base text-gray-700">Deine E-Mail</label>
        <input className="border rounded border-gray-400 p-4 text-xl w-full" type="email" onChange={e => setEmail(e.target.value)}
               placeholder="ich@helfer.de"/>
      </div>
      <div className="mt-4 m-1 w-full">
        Wenn Sie das abschicken stimmen Sie zu, dass wir ihre Kontaktdaten an den Anfragensteller weiterleiten.
      </div>
      <div className="mt-4 m-1 w-full">
        <button type="submit" className="btn-primary">Senden</button>
      </div>
    </form>
  );
}
