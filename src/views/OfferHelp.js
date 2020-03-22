import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import { useParams } from 'react-router-dom';
import { GeoFirestore } from 'geofirestore';
import Entry from '../components/Entry';
import Footer from '../components/Footer';
import dems from '../assets/dems.json';

export default function OfferHelp () {
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [deleted, setDeleted] = useState(false);
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
        setDeleted(true);
      } else {
        console.log('Document data:', doc.data());
        setEntry({ id: doc.id, ...doc.data() });
      }
    });
  };

  function checkForDEM(data) {
    const mail = data.target.value;
    if(mail.includes('@')) {
      var domain = mail.substring(mail.lastIndexOf("@") +1);
      // check if the mail address is included in the DEM-list
      if (dems.includes(domain)) {
        // this is a DEM
        data.target.setCustomValidity("Bitte keine Wegwerf-Emailadresse verwenden.");
      } else {
        // this is not a DEM
        data.target.setCustomValidity("");
      }
    }
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

  if(!deleted) {
    return (<form onSubmit={handleSubmit} className="p-4">
        <div className="mt-4 p-1 font-teaser">
          Antworte auf die Anfrage und beschreibe wie und wann du helfen kannst.
        </div>
        <Entry {...entry} showFullText highlightLeft/>
        <div className="mt-4 p-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">Deine Antwort</label>
          <textarea className="input-focus" onChange={e => setAnswer(e.target.value)} required="required"
                    placeholder="Ich kann helfen!"/>
        </div>
        <div className="mt-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">Deine E-Mail</label>
          <input className="input-focus" type="email" onChange={(e) => checkForDEM(e)} required="required"
                 placeholder="ich@helfer.de" defaultValue={email}/>
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
  } else {
    return (<div className="mt-4 p-4 font-teaser">
      Der Anfragesteller hat die Anfrage bereits wieder offline genommen. Vielen Dank für Deine Unterstützung!
      <div className="mt-4">
        <Link to="/" className="btn-green-secondary block w-full">ANDEREN LEUTEN HELFEN</Link>
      </div>
    </div>)
  }

}
