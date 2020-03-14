import React, {useEffect} from 'react';
import * as firebase from "firebase/app";
import 'firebase/auth';
import Footer from "./Footer";
import fb from "../firebase";
import {GeoFirestore} from "geofirestore";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

export default function CompleteOfferHelp(props) {

  useEffect(() => {
    async function completeSignup() {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

        // TODO: This doesn't seem to work
        let email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
          email = window.prompt('Bitte geben sie die Email ein, mit der sie sich registriert haben');
        }

        await firebase.auth().signInWithEmailLink(email, window.location.href)
        window.localStorage.removeItem('emailForSignIn');

        // TODO: This fails with authentication error b.c. user is not signed in
        //    needs to be enabled on firebase db. Maybe create anonymous user first and later upgrade

        const urlParams = new URLSearchParams(window.location.hash);
        console.log(urlParams.get('#/complete-offer-help?location'));

        const location = urlParams.get('#/complete-offer-help?location');

        const geofirestore = new GeoFirestore(fb.store);
        const offerHelpCollection = geofirestore.collection('/offer-help');

        const result = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(result[0]);

        await offerHelpCollection.add({
          email: email,
          location: location,
          // uid: firebase.auth().currentUser.uid,
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
        Deine Emailadresse wurde verifiziert! Du wirst nun von uns per Email benachrichtigt werden, wenn jemand in ABC
        Hilfe benötigt.
      </p>
      <Footer/>
    </div>
  )
}
