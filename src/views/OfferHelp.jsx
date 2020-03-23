import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import fb from '../firebase';

import Entry from '../components/Entry';
import Footer from '../components/Footer';

export default function OfferHelp() {
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [entry, setEntry] = useState({
    id: null,
    location: null,
    request: null,
    timestamp: null,
  });

  const { id } = useParams();

  const history = useHistory();

  // Create a GeoFirestore reference
  const geofirestore = new GeoFirestore(fb.store);

  // Create a GeoCollection reference
  const geocollection = geofirestore.collection('/ask-for-help');

  const getUserData = () => {
    geocollection.doc(id).get().then((doc) => {
      if (!doc.exists) {
        setDeleted(true);
      } else {
        setEntry({ id: doc.id, ...doc.data() });
      }
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const collection = fb.store.collection(`/ask-for-help/${id}/offer-help`);

    collection.add({
      answer,
      email,
      timestamp: Date.now(),
    });

    return history.push('/success-offer');
  };

  useEffect(getUserData, []);

  if (!deleted) {
    return (
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mt-4 p-1 font-teaser">
          Antworte auf die Anfrage und beschreibe wie und wann du helfen kannst.
        </div>
        <Entry {...entry} showFullText highlightLeft key={entry.id} />
        <div className="mt-4 p-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">Deine Antwort</label>
          <textarea
            className="input-focus"
            onChange={(e) => setAnswer(e.target.value)}
            required="required"
            placeholder="Ich kann helfen!"
          />
        </div>
        <div className="mt-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">Deine E-Mail</label>
          <input
            className="input-focus"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required="required"
            placeholder="ich@helfer.de"
          />
        </div>
        <div className="mt-4 m-1 w-full">
          Wenn Sie das abschicken stimmen Sie zu, dass wir ihre Kontaktdaten an den Anfragensteller weiterleiten.
        </div>
        <div className="mt-4 m-1 w-full">
          <button type="submit" className="btn-green w-full">NACHRICHT ABSCHICKEN</button>
        </div>
        <Footer />
      </form>
    );
  }
  return (
    <div className="mt-4 p-4 font-teaser">
      Der Anfragesteller hat die Anfrage bereits wieder offline genommen. Vielen Dank für Deine Unterstützung!
      <div className="mt-4">
        <Link to="/" className="btn-green-secondary block w-full">ANDEREN LEUTEN HELFEN</Link>
      </div>
    </div>
  );
}
