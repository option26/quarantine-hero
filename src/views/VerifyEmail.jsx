import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Footer from '../components/Footer';


export default () => {
  const [sendVerificationSuccess, setSendVerificationSuccess] = React.useState(false);
  const [user, isAuthLoading] = useAuthState(firebase.auth());

  if (!user && !isAuthLoading) {
    return <Redirect to="/signup" />;
  }

  if (user && user.emailVerified) {
    return <Redirect to="/ask-for-help" />;
  }

  const resendEmail = async (e) => {
    e.preventDefault();
    await user.sendEmailVerification();
    setSendVerificationSuccess(true);
  };

  const recheckEmail = async (e) => {
    e.preventDefault();
    // https://github.com/firebase/firebase-js-sdk/issues/2529
    // https://stackoverflow.com/questions/47243702/firebase-token-email-verified-going-weird
    // after an immediate sign up and email verification, "firebase.auth().currentUser.emailVerified" is set correctly
    // however, "auth.token.email_verified" in the firebase backend gets ist value from the ID token which will not get updated until it expires or it is force refreshed
    // therefore, we need to force refresh the ID token, to make the backend aware that the user is indeed verified, and passes the security rules
    // by design, if the user would log out and log in again, the token would be refreshed as well
    await user.getIdToken(true);
    window.location.reload();
  };

  return (
    <div>
      <h1 className="font-teaser py-4 pt-10">E-Mail Addresse bestätigen</h1>
      <div className="font-open-sans">
        Damit potentielle Helfer*innen auf dich zukommen können, müssen wir sicherstellen, dass deine E-Mail Adresse korrekt hinterlegt ist.
        Bestätige diese bitte indem du auf den Link in der E-Mail, welche wir dir gerade gesendet haben, klickst.
      </div>

      <button type="button" onClick={recheckEmail} className="btn-green w-full mt-8">
        Bestätigung überprüfen
      </button>

      <button type="button" onClick={resendEmail} className="btn-green-secondary w-full mt-4">
        E-Mail erneut senden
      </button>

      {sendVerificationSuccess && <div className="my-5 bg-yellow-100 border rounded p-2 px-4 text-gray-800">Eine Email mit Bestätigungs-Link wurde dir zugesendet!</div>}
      <Footer />

    </div>
  );
};

