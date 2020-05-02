import React, { useRef, useState, useEffect } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
  Link,
  Redirect,
  useParams,
  useLocation,
} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation, Trans } from 'react-i18next';
import MailInput from '../components/MailInput';
import { baseUrl } from '../appConfig';

export default () => (
  <div className="p-4">
    <SignupHeader />
    <SignupBody />
  </div>
);

// We use an array to be able to manage this via the CMS in the future
const partners = [
  { key: 'nachbarhilft', name: 'Nachbar Hilft!', imgSource: require('../assets/150.png') },
  { key: 'test', name: 'Im a partner', imgSource: require('../assets/br.jpg') },
];

function SignupHeader() {
  const { t } = useTranslation();
  const { returnUrl } = useParams();
  const location = useLocation();

  const [source, setSource] = useState(undefined);
  const [user] = useAuthState(firebase.auth());

  const [externalStats] = useDocumentDataOnce(firebase.firestore().collection('stats').doc('external'));

  const reasonForSignup = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : t('views.signUp.reasonForSignupDefault');
  const headerText = t('views.signUp.headerText', { reasonForSignup });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.has('source')) {
      setSource(query.get('source'));
    }
  }, [location]);


  if (user) {
    if (returnUrl) return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  const partner = partners.find((p) => p.key === source);
  if (source && partner) {
    const { name: partnerName, imgSource } = partner;
    if (partnerName && imgSource) {
      const partnerText = (
        <Trans i18nKey="views.signUp.partnerText">
          {{ helpers: externalStats && externalStats.regionSubscribed }}
          {{ partnerName }}
        </Trans>
      );

      return (
        <div className="mt-8 mb-6">
          <div className="flex flex-row md:flex-col-reverse">
            <div className="flex flex-shrink-0 items-center">
              <img className="rounded-full w-24 h-24" src={imgSource} alt="" />
              <p className="ml-4 hidden md:block align-middle">
                {partnerText}
              </p>
            </div>
            <div className="m-2" />
            <div style={{ hyphens: 'manual' }} className="font-teaser">
              {t('views.signUp.headerTextPartner')}
            </div>
          </div>
          <p className="mt-4 md:hidden">
            {partnerText}
          </p>
          <p className="mt-4">
            {headerText}
            {' '}
            {t('views.signUp.headerTextExtended')}
          </p>
        </div>
      );
    }
  }

  return (
    <div className="mt-8 mb-6">
      <div className="font-teaser">
        {headerText}
      </div>
    </div>
  );
}

function SignupBody() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const passwordInput = useRef();
  const passwordRepeatInput = useRef();
  const { t } = useTranslation();
  const { returnUrl } = useParams();
  const location = useLocation();

  const createUserWithEmailAndPassword = (mail, pw) => firebase.auth().createUserWithEmailAndPassword(mail, pw);

  const registerUser = async (e) => {
    // Prevent page reload
    e.preventDefault();

    try {
      const signUpResult = await createUserWithEmailAndPassword(email, password);
      await signUpResult.user.sendEmailVerification({ url: `${baseUrl}/#/${returnUrl || ''}` });
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
    <>
      <form onSubmit={registerUser}>
        <div className="mb-4">
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
    </>
  );
}
