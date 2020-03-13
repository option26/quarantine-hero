import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import fb from '../firebase';
import Entry from './Entry';

export default function Main() {

    const [entries, setEntries] = useState([]);

    const collection = fb.store.collection('ask-for-help');
    const query = collection.orderBy('d.timestamp', 'desc').limit(10);

    const getUserData = () => {
        query.get().then(value => {

            setEntries(value.docs.map(doc => ({...doc.data().d, id: doc.id})));

        });
    };
    useEffect(getUserData, []);

    return (
        <div>
            <div>
                <div className="w-full flex flex-col justify-center items-center mt-16">
                    <img src={require('../logo.png')}/>
                    <p className="text-xl py-4">Wir sind Menschen. In Zeiten der Not helfen wir uns.</p>
                </div>
                <p className="text-xl pt-2 pb-10">

                    Unsere Plattform vermittelt Helfende an Personen, die Hilfe benötigen.<br/>
                    <br/>
                    Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in häuslicher Quarantäne. Ihr
                    könnt diesen Menschen helfen! Auf unserer Seite quarantänehelden.de könnt ihr sehen, wie ihr
                    Mitmenschen in eurem Umfeld unterstützen könnt.<br/>
                    <br/>
                    Und wenn ihr euch gerade in häuslicher Quarantäne befindet oder euer Zuhause nicht verlassen könnt,
                    findet ihr über diese Plattform Unterstützung. Stellt eure Anfrage und findet Helfende. Sie
                    erledigen für euch Einkäufe, Botengänge oder gehen mit eurem Hund Gassi.<br/>
                    <br/>
                    Das geht ganz einfach. Wer Hilfe benötigt, stellt eine Anfrage. Wer helfen möchte, guckt sich die
                    Anfragen in seiner Nähe an und kann entscheiden, wo er/sie aktiv werden kann. Die Kontaktaufnahme
                    läuft dann über diese Plattform.<br/>
                    <br/>
                    Tragt diese Infos bitte auch an andere weiter, die gerne helfe wollen oder die Hilfe von außen
                    benötigen!
                    <br/>
                </p>
                <div className="flex justify-between">
                    <Link to="/overview"

                          className="font-bold py-8 px-4 rounded bg-primary text-center text-white flex-1 mr-4">Ich
                        möchte helfen
                    </Link>
                    <Link to="/signup"

                          className="font-bold py-8 px-4 rounded bg-primary text-center text-white flex-1">Ich brauche
                        Hilfe
                    </Link>
                </div>
                {entries.map(entry => (<Entry {...entry} key={entry.id}/>))}
            </div>
        </div>
    );
}

