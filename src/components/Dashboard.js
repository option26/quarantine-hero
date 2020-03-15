import React, {useEffect, useState} from 'react';
import fb from '../firebase';
import Entry from "./Entry";
import {Redirect} from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default function Dashboard() {

  const [entries, setEntries] = useState([]);
  const [offers, setOffers] = useState([]);
  const [user, setUser] = useState(null);

  firebase.auth().onAuthStateChanged(user => {
    setUser(user);
  });

  const askForHelpCollection = fb.store.collection('ask-for-help');
  const offerHelpCollection = fb.store.collection('offer-help');

  const getUserData = () => {
    const query = askForHelpCollection.where("d.uid", "==", fb.auth.currentUser ? fb.auth.currentUser.uid : "0");
    query.get().then(value => {
      const sortedEntries = value.docs
        .map(doc => ({...doc.data().d, id: doc.id}))
        .sort((a, b) => b.timestamp - a.timestamp);
      setEntries(sortedEntries);
    });
  };

  const getOffers = async () => {
    const uid = fb.auth.currentUser ? fb.auth.currentUser.uid : "0";
    const offerHelpQuery = offerHelpCollection.where("d.uid", "==", uid);
    let response = await offerHelpQuery.get();
    const offers = response.docs.map(val => ({...val.data().d, id: val.id}));
    setOffers(offers);
  };


  useEffect(() => {
    setUser(firebase.auth().currentUser);
    getUserData();
    getOffers();
  }, [user]);

  // TODO: Fix this redirect on page refresh or direct url access!
  //  this redirects b.c the user migth not immediately be available
  //  eventhough he is logged in technically
  if(!fb.auth.currentUser || !fb.auth.currentUser.email) {
    return <Redirect to="/signup"/>;
  }

  const Notification = (props) => {
    // TODO: Add option to delete this!
    return <div className="shadow rounded border mb-4 px-4 py-2">Du wirst benachrichtigt, wenn jemand
      in {props.location} Hilfe benötigt</div>
  };

  return (<div>
    <h1 className="font-teaser py-4 pt-10">Deine Hilfegesuche</h1>

    {entries.length === 0
      ? <div className="font-open-sans">Du hast keine Hilfegesuche eingestellt.</div>
      : entries.map(entry => (<Entry {...entry} key={entry.id} owner={true}/>))}

    <h1 className="font-teaser py-4 pt-10">Deine Benachrichtigungen </h1>

    {offers.length === 0
      ? <div className="font-open-sans">Du hast keine Hilfegesuche eingestellt.</div>
      : offers.map(offer => <Notification location={offer.location}/>)}

  </div>);
}
