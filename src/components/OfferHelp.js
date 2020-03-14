import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import { useParams } from 'react-router-dom';
import { GeoFirestore } from 'geofirestore';
import Entry from './Entry';
import Footer from './Footer';

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

  const history = useHistory();

// Create a GeoFirestore reference
  const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
  const geocollection = geofirestore.collection('/ask-for-help');

  const getUserData = () => {
    geocollection.doc(id).get().then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
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

    return history.push('/success-offer')

  };

  useEffect(getUserData, []);

  return (<form onSubmit={handleSubmit} className="p-4">
      <div className="mt-4 p-1 font-teaser">
        Antworte auf die Anfrage und beschreibe wie und wann du helfen kannst.
      </div>
      <Entry {...entry} showFullText/>
      <div className="mt-4 p-1 w-full">
        <label className="text-gray-700 text-sm font-open-sans">Deine Antwort</label>
        <textarea className="input-focus" onChange={e => setAnswer(e.target.value)}
                  placeholder="Ich kann helfen!"/>
      </div>
      <div className="mt-1 w-full">
        <label className="text-gray-700 text-sm font-open-sans">Deine E-Mail</label>
        <input className="input-focus" type="email" onChange={e => setEmail(e.target.value)}
               placeholder="ich@helfer.de"/>
      </div>
      <div className="mt-4 m-1 w-full">
        Wenn Sie das abschicken stimmen Sie zu, dass wir ihre Kontaktdaten an den Anfragensteller weiterleiten.
      </div>
      <div className="mt-4 m-1 w-full">
        <button type="submit" className="btn-green w-full">NACHRICHT ABSCHICKEN</button>
      </div>
      <Footer/>
    </form>
  );
}
