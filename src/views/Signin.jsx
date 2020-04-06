import React from 'react';
import * as Sentry from '@sentry/browser';
import { useTranslation } from 'react-i18next';
import 'firebase/auth';
import {
  Redirect,
  Link,
  useParams,
  useLocation,
} from 'react-router-dom';
import * as firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import Footer from '../components/Footer';
import MailInput from '../components/MailInput';
import fb from '../firebase';

import { baseUrl } from '../appConfig';

export default function Signin() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const [user] = useAuthState(firebase.auth());
  const signInWithEmailAndPassword = (mail, pw) => firebase.auth().signInWithEmailAndPassword(mail, pw);

  const { returnUrl } = useParams();

  if (user) {
    if (returnUrl) return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  const reasonForSignin = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : t('views.signIn.reasonForSigninDefault');
  const headerText = t('views.signIn.headerText', { reasonForSignin });

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const signInResult = await signInWithEmailAndPassword(email, password);

      if (!signInResult.user) {
        setError(t('views.signIn.unknownError'));
        Sentry.captureException(new Error('signInWithEmailAndPassword returned a result where the user property is null'));
        return;
      }

      if (!signInResult.user.emailVerified) {
        await signInResult.user.sendEmailVerification();
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found': setError(t('views.signIn.noUser')); break;
        case 'auth/wrong-password': setError(t('views.signIn.wrongUserOrPw')); break;
        case 'auth/invalid-email': setError(t('views.signIn.emailInvalid')); break;
        case 'auth/too-many-requests': setError(t('views.signIn.tooManyRequests')); break;
        default: setError(err.message);
      }
    }
  };

  const sendPasswordResetMail = (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError(t('views.signIn.enterEmailForReset'));
      return;
    }

    fb.auth.sendPasswordResetEmail(email, {
      url: `${baseUrl}/#/signin`,
      handleCodeInApp: false,
    })
      .then(() => setPasswordResetSuccess(true))
      .catch(() => setError(t('views.signIn.pwResetError')));
  };

  return (
    <div className="p-4 mt-8">
      <form onSubmit={signIn}>
        <div className="mb-4">
          <div className="font-teaser mb-6">
            {headerText}
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-1 font-open-sans" htmlFor="username">
            {t('views.signIn.email')}
          </label>
          <MailInput
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none input-focus"
            placeholder={t('views.signIn.yourEmail')}
            onChange={setEmail}
            defaultValue={email}
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password">
            {t('views.signIn.password')}
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password"
            type="password"
            placeholder={t('views.signIn.yourPw')}
            value={password}
            autoComplete="current-password"
            required="required"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="float-right text-secondary hover:underline" data-cy="btn-pw-reset" onClick={sendPasswordResetMail}>
            <small>{t('views.signIn.resetPw')}</small>
          </button>
        </div>
        {error && <div data-cy="error-label" className="text-red-500">{error}</div>}
        {passwordResetSuccess && <div data-cy="pw-reset-success-label" className="my-5 bg-yellow-100 border rounded p-2 px-4 text-gray-800">{t('views.signIn.pwResetConfirmation')}</div>}
        <div className="flex justify-end mt-6">
          <button
            className="btn-green w-full"
            type="submit"
          >
            {t('views.signIn.loginNow')}
          </button>
        </div>
      </form>
      <Link
        to={{
          pathname: `/signup${returnUrl ? `/${returnUrl}` : ''}`,
          state: location !== undefined && location.state,
        }}
        className="mt-2 btn-green-secondary block w-full"
        data-cy="btn-register"
      >
        {t('views.signIn.registerNow')}
      </Link>
      <Footer />
    </div>
  );
}
