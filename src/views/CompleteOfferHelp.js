import React, {useEffect, useState} from 'react';
import * as firebase from "firebase/app";
import 'firebase/auth';
import Footer from "../components/Footer";
import fb from "../firebase";
import {GeoFirestore} from "geofirestore";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {Link} from "react-router-dom";
import {isMapsApiEnabled} from '../featureFlags.js';
import {useTranslation} from "react-i18next";

export default function CompleteOfferHelp(props) {

  const { t, i18n } = useTranslation();
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
          email = window.prompt(t('completeOfferHelp.mailYouRegistered'));
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

        fb.analytics.logEvent('success_subscribe_region_confirmation');
      }
    }

    completeSignup();

  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-exo2 mt-10 mb-6">{t('completeOfferHelp.youAreHero')}</h1>
      <p>
        {t('completeOfferHelp.youAreHero')} <span className="text-secondary">{location}</span> {t('completeOfferHelp.needsHelp')}.
      </p>
      <div className="flex justify-center flex-col items-center mb-8">
        <img className="h-48 w-48 my-10" src={require('../assets/success.svg')} alt=""/>
        <Link className="btn-green mt-10" to={'/dashboard'}>{t('completeOfferHelp.toYourOverview')}</Link>
      </div>
      <Footer/>
    </div>
  )
}
