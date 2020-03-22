import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import fb from '../firebase';
import Entry from '../components/Entry';

const askForHelpCollection = fb.store.collection('ask-for-help');
const offerHelpCollection = fb.store.collection('offer-help');

const getUserData = async (currentUser) => {
  const query = askForHelpCollection.where('d.uid', '==', currentUser.uid);
  const value = await query.get();
  const sortedEntries = value.docs
    .map((doc) => ({ ...doc.data().d, id: doc.id }))
    .sort((a, b) => b.timestamp - a.timestamp);
  return sortedEntries;
};

const getOffers = async (currentUser) => {
  const offerHelpQuery = offerHelpCollection.where('d.uid', '==', currentUser.uid);
  const response = await offerHelpQuery.get();
  return response.docs.map((val) => ({ ...val.data().d, id: val.id }));
};

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [offers, setOffers] = useState([]);
  const [user, isAuthLoading] = useAuthState(fb.auth);

  const handleDelete = (id) => {
    offerHelpCollection.doc(id).delete();
  };

  useEffect(() => {
    if (user) {
      getUserData(user).then(setEntries);
      getOffers(user).then(setOffers);
    }
  }, [user]);

  if (!isAuthLoading && (!user || !user.email)) {
    return <Redirect to="/signup/dashboard" />;
  }

  const Notification = (props) => {
    // TODO: Add option to delete this!
    const [hidden, setHidden] = useState(false);

    return (
      <div>
        { hidden ? '' : (
          <div className="shadow rounded border mb-4 px-4 py-2 flex justify-between">
            Du wirst benachrichtigt, wenn jemand in der Nähe von
            {' '}
            {props.location}
            {' '}
            Hilfe benötigt
            <div className="cursor-pointer font-bold" onClick={() => { setHidden(true); handleDelete(props.id); }}>
              &times;
            </div>
          </div>
        ) }
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="font-teaser py-4 pt-10">Deine Hilfegesuche</h1>

      {entries.length === 0
        ? (
          <div className="font-open-sans">
            Du hast noch keine Hilfegesuche eingestellt. Du kannst ein neues Gesuch
            {' '}
            <Link className="text-secondary hover:underline" to="/ask-for-help" onClick={() => fb.analytics.logEvent('button_want_to_help')}>hier</Link>
            {' '}
            erstellen.
          </div>
        )
        : entries.map((entry) => (<Entry {...entry} key={entry.id} owner />))}

      <h1 className="font-teaser py-4 pt-10">Deine Benachrichtigungen </h1>

      {offers.length === 0
        ? (
          <div className="font-open-sans">
            Du hast noch keine Benachrichtigungen aktiviert. Du kannst neue Benachrichtigungen
            {' '}
            <Link className="text-secondary hover:underline" to="/notify-me" onClick={() => fb.analytics.logEvent('button_subscribe_region')}>hier</Link>
            {' '}
            registrieren.
          </div>
        )
        : offers.map((offer) => <Notification location={offer.location} id={offer.id} key={offer.id} />)}

    </div>
  );
}
