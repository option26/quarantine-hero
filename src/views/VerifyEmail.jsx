import React from 'react';
import { Redirect } from 'react-router-dom';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebaseApp from 'firebase';
import Footer from '../components/Footer';

const firebaseAppAuth = firebaseApp.auth();

const VerifyEmail = (props) => {
  const [sendVerificationSuccess, setSendVerificationSuccess] = React.useState(false);

  const {
    user,
  } = props;

  if (user && user.emailVerified) return <Redirect to="/ask-for-help" />;

  const resendEmail = async (e) => {
    e.preventDefault();
    await user.sendEmailVerification();
    setSendVerificationSuccess(true);
  };

  const recheckEmail = (e) => {
    e.preventDefault();
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

export default withFirebaseAuth({
  providers: [],
  firebaseAppAuth,
})(VerifyEmail);
