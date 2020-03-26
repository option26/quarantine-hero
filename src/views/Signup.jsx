import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebaseApp from 'firebase/app';
import 'firebase/auth';
import {
  Redirect,
  useParams,
  useLocation,
} from 'react-router-dom';
import Footer from '../components/Footer';
import MailInput from '../components/MailInput';

const firebaseAppAuth = firebaseApp.auth();

const Signup = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const location = useLocation();

  const {
    user,
    createUserWithEmailAndPassword,
  } = props;
  const { returnUrl } = useParams();

  if (user) {
    if (returnUrl) return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  const reasonForSignup = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : 'eine Hilfe-Anfrage zu posten';
  const headerText = `Registriere dich mit deiner E-Mail und einem Passwort um ${reasonForSignup}.`;

  // eslint-disable-next-line consistent-return
  const registerUser = async (e) => {
    // Prevent page reload
    e.preventDefault();

    const signUpResult = await createUserWithEmailAndPassword(email, password);
    if (signUpResult.code) {
      switch (signUpResult.code) {
        case 'auth/email-already-in-use': return setError('Es existiert bereits ein account mit dieser Email-Adresse.');
        case 'auth/weak-password': return setError('Das Passwort muss mindestens sechs Zeichen lang sein.');
        default: return setError(signUpResult.message);
      }
    }
    if (!signUpResult.code) await signUpResult.user.sendEmailVerification();
  };

  return (
    <div className="p-4 mt-8">
      <form onSubmit={registerUser}>
        <div className="mb-4">
          <div className="font-teaser mb-6">
            {headerText}
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
        </div>
        {error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : ''}
        <div className="flex justify-end my-6">
          <button
            className="btn-green w-full"
            type="submit"
          >
            Jetzt Registrieren
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default withFirebaseAuth({
  providers: [],
  firebaseAppAuth,
})(Signup);
