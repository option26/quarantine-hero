import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import fb from '../firebase';
import Entry from './Entry';

export default function Main() {

    const [entries, setEntries] = useState([]);

    const collection = fb.store.collection('ask-for-help');
    const getUserData = () => {
        collection.get().then(value => {
      console.log(value.docs);
            setEntries(value.docs.map(doc => ({...doc.data().d, id: doc.id})));

    });
    };
    useEffect(getUserData, []);

    return (
        <div>
            <div>
                <div className="w-full flex justify-center items-center mt-16">
                    <img src={require('../logo.png')}/>
                </div>
                <p className="text-xl py-4">Wir sind Menschen. In Zeiten der Not helfen wir uns. Sei ein Teil davon.</p>
                <p className="text-xl pt-2 pb-2">Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise
                    in
                    häuslicher Quarantäne. Wenn ihr diesen Menschen helfen wollt, könnt ihr hier sehen, wobei ihr eure
                    Mitmenschen in eurer Nachbarschaft unterstützen könnt!<br/><br/>
                    Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung bei Einkäufen, Botengängen oder
                    Gassigehen mit dem Hund benötigt könnt ihr das hier euren Mitmenschen mitteilen!
                </p>
                <div className="flex justify-between">
                    <Link to="/overview"

                          className="font-bold py-8 px-4 rounded bg-primary text-center text-white flex-1 mr-4">Ich möchte helfen
                    </Link>
                    <Link to="/signup"

                          className="font-bold py-8 px-4 rounded bg-primary text-center text-white flex-1">Ich brauche Hilfe
                    </Link>
                </div>
                {entries.map(entry => (<Entry {...entry} key={entry.id}/>))}
            </div>
        </div>
    );
}

