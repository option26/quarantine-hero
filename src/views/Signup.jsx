import React, { useRef } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
  Link,
  Redirect,
  useParams,
  useLocation,
} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import MailInput from '../components/MailInput';
import { baseUrl } from '../appConfig';

export default () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [user] = useAuthState(firebase.auth());
  const location = useLocation();
  const passwordInput = useRef();
  const passwordRepeatInput = useRef();
  const { t } = useTranslation();
  const { returnUrl } = useParams();

  const createUserWithEmailAndPassword = (mail, pw) => firebase.auth().createUserWithEmailAndPassword(mail, pw);

  if (user) {
    if (returnUrl) return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  const reasonForSignup = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : t('views.signUp.reasonForSignupDefault');
  const headerText = t('views.signUp.headerText', { reasonForSignup });

  const registerUser = async (e) => {
    // Prevent page reload
    e.preventDefault();

    try {
      const signUpResult = await createUserWithEmailAndPassword(email, password);
      await signUpResult.user.sendEmailVerification({ url: `${baseUrl}/#/${returnUrl}` });
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use': setError(t('views.signUp.emailInUse')); break;
        case 'auth/weak-password': setError(t('views.signUp.pwTooShort')); break;
        case 'auth/invalid-email': setError(t('views.signUp.emailInvalid')); break;
        default: setError(err.message);
      }
    }
  };

  const comparePasswords = () => {
    if (passwordInput.current.value !== passwordRepeatInput.current.value) {
      passwordRepeatInput.current.setCustomValidity(t('views.signUp.pwMismatch'));
    } else {
      passwordRepeatInput.current.setCustomValidity('');
    }
  };

  return (
    <div className="p-4 mt-8">
      <form onSubmit={registerUser}>
        <div className="mb-4">
          <div className="font-teaser mb-6">
            {headerText}
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-1 font-open-sans" htmlFor="username">
            {t('views.signUp.email')}
          </label>
          <MailInput
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none input-focus"
            placeholder={t('views.signUp.yourEmail')}
            onChange={setEmail}
            defaultValue={email}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password">
            {t('views.signUp.password')}
          </label>
          <input
            ref={passwordInput}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password"
            type="password"
            placeholder={t('views.signUp.yourPw')}
            value={password}
            required="required"
            autoComplete="new-password"
            onChange={(e) => {
              comparePasswords();
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password_repeat">
            {t('views.signUp.passwordRepeat')}
          </label>
          <input
            ref={passwordRepeatInput}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password_repeat"
            type="password"
            autoComplete="new-password"
            placeholder={t('views.signUp.confirmPassword')}
            required="required"
            onChange={comparePasswords}
          />
        </div>
        {error && <div data-cy="error-label" className="text-red-500">{error}</div>}
        <div className="flex justify-end mt-6">
          <button
            className="btn-green w-full"
            type="submit"
          >
            {t('views.signUp.registerNow')}
          </button>
        </div>
      </form>
      <Link
        to={{
          pathname: `/signin${returnUrl ? `/${returnUrl}` : ''}`,
          state: location !== undefined && location.state,
        }}
        data-cy="btn-account-exists"
        className="mt-2 btn-green-secondary block w-full"
      >
        {t('views.signUp.haveAnAccount')}
      </Link>
    </div>
  );
};
