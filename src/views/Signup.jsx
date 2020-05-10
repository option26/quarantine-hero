import React, { useRef, useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
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
import { useTranslation } from 'react-i18next';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MailInput from '../components/MailInput';
import fb from '../firebase';
import { baseUrl } from '../appConfig';
import useQuery from '../util/useQuery';
import * as Sentry from '@sentry/browser';

export default () => (
  <div className="p-4">
    <SignupHeader />
    <SignupBody />
  </div>
);

// We use an array to be able to manage this via the CMS in the future
const partners = [
  { key: 'nachbarhilft', name: 'In Quarantäne? Nachbar hilft!', imgSource: require('../assets/nachbar_hilft.png') },
];

function SignupHeader() {
  const { t } = useTranslation();
  const { returnUrl } = useParams();
  const { source, fullExplanation } = useQuery();
  const location = useLocation();
  const [user] = useAuthState(firebase.auth());

  const { name: partnerName, imgSource: partnerImg } = partners.find((p) => p.key === source) || {};
  const showPartner = !!(partnerName && partnerImg);

  const reasonForSignup = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : t('views.signUp.reasonForSignupDefault');
  const headerText = t('views.signUp.headerText', { reasonForSignup });

  if (user) {
    if (returnUrl) return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    return user.emailVerified ? <Redirect to="/ask-for-help" /> : <Redirect to="/verify-email" />;
  }

  return (
    <div className="mt-8 mb-6">
      <div className="font-teaser">
        {(showPartner || fullExplanation) ? t('views.signUp.welcomeAtQh') : headerText}
      </div>
      {showPartner && <Partner partnerName={partnerName} partnerImg={partnerImg} />}
      {fullExplanation && <Explanation />}
      {(showPartner || fullExplanation) && (
        <p className="mt-4">
          {headerText}
          {' '}
          {t('views.signUp.headerTextExtended')}
        </p>
      )}
    </div>
  );
}

function Partner({ partnerName, partnerImg }) {
  const { t } = useTranslation();
  const [externalStats] = useDocumentDataOnce(firebase.firestore().collection('stats').doc('external'));

  return (
    <div className="mt-4 flex flex-row items-center">
      <img className="rounded-full w-24 h-24" src={partnerImg} alt="" />
      <div className="mx-4 my-2" />
      <p className="text-sm sm:text-base">
        {t('views.signUp.partnerTextIntro', { helpers: externalStats && externalStats.regionSubscribed })}
        <br />
        <strong>{partnerName}</strong>
        {' '}
        {t('views.signUp.partnerTextOutro')}
      </p>
    </div>
  );
}

function Explanation() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="mt-4 mb-1 px-4 py-2 flex justify-start items-center bg-kaki w-full focus:outline-none"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <div className="font-semibold">{t('views.signUp.whatIsQh')}</div>
        <div className="flex-1" />
        {
          React.createElement((isOpen ? ExpandLessIcon : ExpandMoreIcon), {
            className: 'cursor-pointer hover:opacity-50',
            style: { fontSize: '40px' },
          })
        }
      </button>
      <Collapse in={isOpen}>
        <div className="p-4 bg-kaki">
          Wir vermitteln Hilfe für Menschen, die aufgrund der Corona-Krise auf Unterstützung bei Besorgungen angewiesen sind!
          <br />
          <br />
          Du benötigst aktuell Hilfe bei Besorgungen oder kennst Menschen, die gerade Unterstützung gebrauchen können? Finde jetzt unkompliziert freiwillige helfende Hände auf QuarantäneHeld*innen. Inseriere Dein Gesuch ganz unkompliziert über unsere Plattform oder unsere Rufnummer und finde Helfende in Deiner Umgebung.
          <br />
          <br />
          Wenn Du selbst Hilfe anbieten möchtest, kannst Du Dich auch als Helfende*r melden und wirst benachrichtigt, wenn Menschen in Deiner Umgebung Hilfe benötigen.
        </div>
      </Collapse>
    </>
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
  const { source } = useQuery();

  const createUserWithEmailAndPassword = (mail, pw) => firebase.auth().createUserWithEmailAndPassword(mail, pw);

  const registerUser = async (e) => {
    // Prevent page reload
    e.preventDefault();

    try {
      const userSource = source || 'direct';
      const signUpResult = await createUserWithEmailAndPassword(email, password);
      await signUpResult.user.sendEmailVerification({ url: `${baseUrl}/#/${returnUrl || ''}` });
      await fb.store.collection('users').doc(signUpResult.user.uid).set({ source: userSource });
      fb.analytics.logEvent(`signup_${userSource}`);
    } catch (err) {
      Sentry.captureException(err);
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
