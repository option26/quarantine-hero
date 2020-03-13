import {Link} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GeoFirestore } from 'geofirestore';
import fb from '../firebase';
import Entry from './Entry';

export default function Main() {

  const [entries, setEntries] = useState([]);


  const getUserData = () => {
// Create a Firestore reference

// Create a GeoFirestore reference
    const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
    const geocollection = geofirestore.collection('ask-for-help');

// Add a GeoDocument to a GeoCollection
    geocollection.get().then(value => {
      console.log(value.docs)
      setEntries(value.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
    /*
    // Create a GeoQuery based on a location
        const query = geocollection.near({ center: new fb.app.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

    // Get query (as Promise)
        query.get().then((value) => {
          // All GeoDocument returned by GeoQuery, like the GeoDocument added above
          //setEntry(value.docs[0].data());
        });*/
  };
  useEffect(getUserData, []);


    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FDF4EA',
            flexDirection: 'column',
            padding: '30px'
        }}>
            <div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{height: '300px'}} src={require('../logo.png')}></img>
                </div>
                <p className="text-xl p-4">Wir sind Menschen. In Zeiten der Not helfen wir uns. Sei ein Teil davon.</p>
                <div style={{display: 'flex', marginTop: '20px', marginBottom: '50px'}}>
                    <Link to="/signup" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich möchte helfen
                    </Link>
                    <div style={{width: '30px'}}></div>
                    <Link to="/ask-for-help" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich brauche Hilfe
                    </Link>
                </div>
                {entries.map(entry => (<Entry {...entry}/>))}
            </div>
        </div>
    );
}

