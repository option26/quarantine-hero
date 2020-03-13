import React, {useEffect, useState} from 'react';
import fb from '../firebase';
import Entry from "./Entry";

export default function Dashboard() {

  const [entries, setEntries] = useState([]);

  const collection = fb.store.collection('ask-for-help');
  const query = collection.where("d.uid", "==", fb.auth.currentUser ? fb.auth.currentUser.uid : "0");

  const getUserData = () => {
    query.get().then(value => {
      const sortedEntries = value.docs
        .map(doc => ({...doc.data().d, id: doc.id}))
        .sort((a, b) => b.timestamp - a.timestamp);
      setEntries(sortedEntries);
    });
  };


  useEffect(getUserData, []);

  return (<div>
    <h2 className="text-2xl">Deine Hilfegesuche</h2>
    {entries.map(entry => (<Entry {...entry} key={entry.id}/>))}

  </div>);
}
