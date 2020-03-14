import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import Entry from './Entry';
import '../styles/App.css';

export default function Main () {

  const [entries, setEntries] = useState([]);

  const collection = fb.store.collection('ask-for-help');
  const query = collection.orderBy('d.timestamp', 'desc').limit(10);

  const getUserData = () => {
    query.get().then(value => {

      setEntries(value.docs.map(doc => ({ ...doc.data().d, id: doc.id })));

    });
  };
  useEffect(getUserData, []);

  return (
    <div>
      <div>
        <div className="font-main flex text-white">
          <img src={(require('../assets/logo_main.png'))}/>
        </div>
        <div className="flex text-center font-teaser justify-center w-full">
          Wir sind Menschen.<br/>
          In Zeiten der Not helfen wir uns.<br/>
          Sei ein Teil davon.<br/>
        </div>
        <div className="flex justify-around my-6">
          <Link to="/overview" className="flex justify-center items-center rounded text-white py-3 px-3 btn-main bg-secondary"><img className="w-6 mr-2"  src={require('../assets/hero.png')} />ICH MÖCHTE HELFEN</Link>
          <Link to="/signup" className="flex justify-center items-center rounded text-white py-3 px-3 btn-main bg-primary"><img className="w-6 mr-2"  src={require('../assets/need_help.png')} />ICH BRAUCHE HILFE</Link>
        </div>
        <p className="p-4 font-open-sans">
          Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in <strong>häuslicher Quarantäne</strong>. Wenn ihr diesen Menschen
          helfen wollt, könnt
          ihr hier sehen, wobei ihr eure Mitmenschen in eurer Nachbarschaft unterstützen könnt!<br/>
          <br/>
          Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung
          bei <strong>Einkäufen</strong>, <strong>Botengängen</strong> oder <strong>Gassigehen</strong> mit dem Hund benötigt könnt ihr
          das hier euren Mitmenschen mitteilen!
        </p>
        {entries.map(entry => (<Entry {...entry} key={entry.id}/>))}
      </div>
    </div>
  );
}

