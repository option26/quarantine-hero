import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebaseApp from 'firebase/app';
import 'firebase/auth';
import { Redirect, Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import MailInput from '../components/MailInput';
import fb from '../firebase';
import { baseUrl } from '../appConfig';

const firebaseAppAuth = firebaseApp.auth();

const Signin = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = React.useState(false);

  const {
    user,
    signInWithEmailAndPassword,
  } = props;
  const { returnUrl } = useParams();

  if (user) {
    if (returnUrl) return <Redirect to={`/${returnUrl}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  // eslint-disable-next-line consistent-return
  const signIn = async (e) => {
    e.preventDefault();
    const signInResult = await signInWithEmailAndPassword(email, password);
    if (signInResult.code) {
      switch (signInResult.code) {
        case 'auth/user-not-found': return setError('Es existiert kein Nutzer mit dieser Email. Bitte registriere dich zuerst.');
        case 'auth/wrong-password': return setError('Falsche Email Adresse oder falsches Passwort angegeben.');
        default: return setError(signInResult.message);
      }
    }
    if (!signInResult.user.emailVerified) await signInResult.user.sendEmailVerification();
  };

  // eslint-disable-next-line consistent-return
  const sendPasswordResetMail = async (e) => {
    e.preventDefault();
    if (!email) return setError('Bitte fülle das E-Mail Feld aus, um dein Passwort zurück zu setzen.');
    fb.auth.sendPasswordResetEmail(email, {
      url: `${baseUrl}/#/signin`,
      handleCodeInApp: false,
    })
      .then(() => setPasswordResetSuccess(true))
      .catch(() => setError('Fehler beim Passwort zurücksetzen. Bist du sicher, dass es seine E-Mail ist?'));
  };

  return (
    <div className="p-4 mt-8">
      <form onSubmit={signIn}>
        <div className="mb-4">
          <div className="font-teaser mb-6">
            Bitte melde dich an um eine Hilfe-Anfrage zu posten.
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-1 font-open-sans" htmlFor="username">
            Email
          </label>
          <MailInput className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none input-focus" placeholder="Deine Emailadresse" onSetEmail={setEmail} defaultValue={email} />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password">
            Passwort
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password"
            type="password"
            placeholder="Dein Passwort"
            value={password}
            required="required"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="float-right text-secondary hover:underline" onClick={sendPasswordResetMail}>
            <small>Passwort zurücksetzen</small>
          </button>
        </div>
        {error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : ''}
        <div className="flex justify-end mt-6">
          <button
            className="btn-green w-full"
            type="submit"
          >
            Jetzt anmelden
          </button>
        </div>
      </form>
      <Link to={`/signup/${returnUrl || ''}`} className="mt-2 btn-green-secondary block w-full">
        Neu registrieren
      </Link>
      {passwordResetSuccess && <div className="my-5 bg-yellow-100 border rounded p-2 px-4 text-gray-800">Eine Email mit Anleitung zum Zurücksetzen deines Passworts wurde dir zugesendet!</div>}
      <Footer />
    </div>
  );
};

export default withFirebaseAuth({
  providers: [],
  firebaseAppAuth,
})(Signin);
