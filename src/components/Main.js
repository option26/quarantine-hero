import {Link} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import fb from '../firebase';
import Entry from './Entry';

export default function Main() {

  const [entries, setEntries] = useState([]);

  const geofirestore = new GeoFirestore(fb.store);
  const geocollection = geofirestore.collection('ask-for-help');
  const getUserData = () => {
    geocollection.get().then(value => {
      setEntries(value.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

  };
  useEffect(getUserData, []);


    return (
        <div>
            <div>
                <div className="w-full flex justify-center items-center mt-16">
                    <img style={{height: '300px'}} src={require('../logo.png')}></img>
                </div>
                <p className="text-xl p-4">Wir sind Menschen. In Zeiten der Not helfen wir uns. Sei ein Teil davon.</p>
                <div style={{display: 'flex', marginTop: '20px', marginBottom: '50px'}}>
                    <Link to="/overview" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich möchte helfen
                    </Link>
                    <div style={{width: '30px'}}></div>
                    <Link to="/signup" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich brauche Hilfe
                    </Link>
                </div>
                {entries.map(entry => (<Entry {...entry}/>))}
            </div>
        </div>
    );
}

