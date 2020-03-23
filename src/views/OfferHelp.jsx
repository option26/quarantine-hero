import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';

import Entry from '../components/Entry';
import Footer from '../components/Footer';
import MailInput from '../components/MailInput';

export default function OfferHelp() {
  const { t } = useTranslation();

  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [entry, setEntry] = useState({
    id: null,
    uid: null,
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
          {t('views.offerHelp.replyToRequest')}
        </div>
        <Entry {...entry} showFullText highlightLeft key={entry.id} />
        <div className="mt-4 p-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">{t('views.offerHelp.yourReply')}</label>
          <textarea
            className="input-focus"
            onChange={(e) => setAnswer(e.target.value)}
            required="required"
            placeholder={t('views.offerHelp.placeholderReply')}
          />
        </div>
        <div className="mt-1 w-full">
          <label className="text-gray-700 text-sm font-open-sans">{t('views.offerHelp.yourEmail')}</label>
          <MailInput className="input-focus" placeholder={t('views.offerHelp.placeholderEmail')} onSetEmail={setEmail} defaultValue={email} />
        </div>
        <div className="mt-4 m-1 w-full">
          {t('views.offerHelp.privacy')}
        </div>
        <div className="mt-4 m-1 w-full">
          <button type="submit" className="btn-green w-full">{t('views.offerHelp.submit')}</button>
        </div>
        <Footer />
      </form>
    );
  }
  return (
    <div className="mt-4 p-4 font-teaser">
      {t('views.offerHelp.alreadyOffline')}
      <div className="mt-4">
        <Link to="/" className="btn-green-secondary block w-full">{t('views.offerHelp.helpSomeoneElse')}</Link>
      </div>
    </div>
  );
}
