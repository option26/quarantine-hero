import React, {useEffect} from 'react';
import * as firebase from "firebase/app";
import 'firebase/auth';
import Footer from "./Footer";

export default function CompleteOfferHelp(props) {

  useEffect(() => {
    async function completeSignup() {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignin');

        if (!email) {
          email = window.prompt('Bitte geben sie die Email ein, mit der sie sich registriert haben');
        }

        await firebase.auth().signInWithEmailLink(email, window.location.href)
        window.localStorage.removeItem('emailForSignIn');
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
