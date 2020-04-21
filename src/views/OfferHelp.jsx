import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';

import Entry from '../components/entry/Entry';
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

  const handleSubmit = (e) => {
    // Prevent page reload
    e.preventDefault();

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
        <Entry
          key={entry.id}
          location={entry.location}
          id={entry.id}
          request={entry.request}
          timestamp={entry.timestamp}
          responses={entry.responses}
          reportedBy={entry.reportedBy}
          uid={entry.uid}
          showFullText
          highlightLeft
        />
        <div className="mt-4 p-1 w-full">
          <label htmlFor="offer-help-reply" className="text-gray-700 text-sm font-open-sans">{t('views.offerHelp.yourReply')}</label>
          <textarea
            id="offer-help-reply"
            className="input-focus"
            data-cy="offer-help-text-input"
            onChange={(e) => setAnswer(e.target.value)}
            required="required"
            placeholder={t('views.offerHelp.placeholderReply')}
          />
        </div>
        <div className="mt-1 w-full">
          <label htmlFor="your-email" className="text-gray-700 text-sm font-open-sans">{t('views.offerHelp.yourEmail')}</label>
          <MailInput
            id="your-email"
            className="input-focus"
            placeholder={t('views.offerHelp.placeholderEmail')}
            onChange={setEmail}
            defaultValue={email}
          />
        </div>
        <div className="mt-4 m-1 w-full">
          {t('views.offerHelp.privacy')}
        </div>
        <div className="mt-4 m-1 w-full">
          <button type="submit" data-cy="offer-help-submit" className="btn-green w-full">{t('views.offerHelp.submit')}</button>
        </div>
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
