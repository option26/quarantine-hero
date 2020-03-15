import React, {useEffect, useState} from 'react';
import * as firebase from "firebase/app";
import 'firebase/auth';
import Footer from "./Footer";
import fb from "../firebase";
import {GeoFirestore} from "geofirestore";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {Link} from "react-router-dom";
import {isMapsApiEnabled} from '../featureFlags.js';

export default function CompleteOfferHelp(props) {

  const [location, setLocation] = useState('');

  useEffect(() => {
    async function completeSignup() {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

        const emailRegex = window.location.href.match(/email=([^&]*)/);
        let email;
        if (emailRegex && emailRegex.length > 1 && emailRegex[1]) {
          email = emailRegex[1];
        } else {
          // TODO: Use nice input for this!
          // We only end up here if there is no email set in the localStorage of the users browser
          // this might happen e.g. if the user signs up on his desktop pc and clicks the confirmation
          // link in his mobile phones email client.
          email = window.prompt('Bitte geben sie die Email ein, mit der sie sich registriert haben');
        }

        await fb.auth.signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');

        const urlParams = new URLSearchParams(window.location.hash);
        console.log(urlParams.get('#/complete-offer-help?location'));

        const location = urlParams.get('#/complete-offer-help?location');
        setLocation(location);

        const geofirestore = new GeoFirestore(fb.store);
        const offerHelpCollection = geofirestore.collection('/offer-help');
        let lat = 0;
        let lng = 0;
        if(isMapsApiEnabled) {
          const result = await geocodeByAddress(location);
          const coordinates = await getLatLng(result[0]);
          lat = coordinates.lat;
          lng = coordinates.lng;
        }

        await offerHelpCollection.add({
          email: email,
          location: location,
          plz: location,
          uid: firebase.auth().currentUser.uid,
          timestamp: Date.now(),
          coordinates: new fb.app.firestore.GeoPoint(lat, lng),
        });
      }
    }

    completeSignup();

  }, []);

  return (
    <div>
      <h1 className="text-2xl font-exo2 mt-10 mb-6">Du bist eine Held*in!</h1>
      <p>
        Deine Emailadresse wurde verifiziert! Du wirst nun von uns per Email benachrichtigt werden, wenn jemand
        in <span className="text-secondary">{location}</span> Hilfe benötigt.
      </p>
      <div className="flex justify-center flex-col items-center mb-8">
        <img className="h-48 w-48 my-10" src={require('../assets/success.svg')} alt=""/>
        <Link className="btn-green mt-10" to={'/dashboard'}>ZU DEINER ÜBERSICHT</Link>
      </div>
      <Footer/>
    </div>
  )
}
