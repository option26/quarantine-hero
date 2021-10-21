import { useRef, useState } from 'react';
import * as React from 'react';
import Collapse from '@material-ui/core/Collapse';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import {
  Link,
  Redirect,
  useParams,
  useLocation,
} from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation, Trans } from 'react-i18next';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MailInput from '../components/MailInput';
import fb from '../firebase';
import { baseUrl } from '../appConfig';
import useQuery from '../util/useQuery';
import { useEmailVerified } from '../util/emailVerified';
import weakPasswords from '../assets/password-top500.json';
import useCms from '../util/useCms';
import useFirebaseDownload from '../util/useFirebaseDownload';
import { CheckIcon } from '../util/Icons';

export default () => (
  <div className="p-4">
    <SignupHeader />
    <SignupBody />
  </div>
);

function SignupHeader() {
  const { t } = useTranslation();
  const { returnUrl } = useParams();
  const { source, fullExplanation } = useQuery();
  const [emailVerified, emailVerifiedLoading] = useEmailVerified(fb.auth);
  const [partners] = useCms('whitelabeling');

  const location = useLocation();
  const [user] = useAuthState(fb.auth);

  const { name: partnerName, logo: logoSource } = partners.find((p) => p.key === source) || {};
  const showPartner = !!(partnerName && logoSource);

  const reasonForSignup = location && location.state && location.state.reason_for_registration
    ? location.state.reason_for_registration
    : t('views.signUp.reasonForSignupDefault');
  const headerText = t('views.signUp.headerText', { reasonForSignup });

  if (user) {
    if (returnUrl) {
      return <Redirect to={`/${decodeURIComponent(returnUrl)}`} />;
    }

    if (!emailVerifiedLoading && !emailVerified) {
      return <Redirect to="/verify-email" />;
    }

    if (!emailVerifiedLoading && emailVerified) {
      return <Redirect to="/ask-for-help" />;
    }
  }

  return (
    <div className="mt-8 mb-6">
      <div className="font-teaser">
        {(showPartner || fullExplanation) ? t('views.signUp.welcomeAtQh') : headerText}
      </div>
      {showPartner && <Partner partnerName={partnerName} logoSource={logoSource} />}
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

function Partner({ partnerName, logoSource }) {
  const { t } = useTranslation();
  const [externalStats] = useDocumentDataOnce(fb.store.collection('stats').doc('external'));
  const [logoLink] = useFirebaseDownload(logoSource);

  return (
    <div className="mt-4 flex flex-row items-center">
      <img className="rounded-full w-24 h-24" src={logoLink} alt="" />
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
          {t('views.signUp.conveyHelp')}
          <br />
          <br />
          {t('views.signUp.youNeedHelp')}
          <br />
          <br />
          {t('views.signUp.wantOfferHelp')}
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

  const createUserWithEmailAndPassword = (mail, pw) => fb.auth.createUserWithEmailAndPassword(mail, pw);

  const registerUser = async (e) => {
    // Prevent page reload
    e.preventDefault();

    try {
      const userSource = source || 'direct';

      if (weakPasswords.includes(password)) {
        // eslint-disable-next-line no-throw-literal
        throw { code: 'weak-password', message: 'No default passwords allowed' };
      }

      const signUpResult = await createUserWithEmailAndPassword(email, password);
      await signUpResult.user.sendEmailVerification({ url: `${baseUrl}/#/${returnUrl || ''}` });
      await fb.store.collection('users').doc(signUpResult.user.uid).set({ source: userSource });
      fb.analytics.logEvent(`signup_${userSource}`);
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use': setError(t('views.signUp.emailInUse')); break;
        case 'auth/weak-password': setError(t('views.signUp.pwTooShort')); break;
        case 'auth/invalid-email': setError(t('views.signUp.emailInvalid')); break;
        case 'weak-password': setError(t('views.signUp.weakPassword')); break;
        default: {
          setError(err.message);
          Sentry.captureException(err);
        }
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
            minLength="12"
            autoComplete="new-password"
            onChange={(e) => {
              comparePasswords();
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
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
        <div className="mb-8">
          <label className="flex text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="privacy_policy">
            <div className="bg-white border rounded w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 checkbox">
              <input id="privacy_policy" type="checkbox" required="required" className="opacity-0 absolute" />
              <img alt="" className="fill-current hidden w-4 h-4 pointer-events-none" src={CheckIcon} />
            </div>
            <div className="select-none">
              <Trans i18nKey="views.signUp.acceptPrivacyPolicy">
                text
                <a href={`${baseUrl}/#/privacy-policy`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">text</a>
                text
              </Trans>
            </div>
          </label>
        </div>
        {error && <div data-cy="error-label" className="text-red-500">{error}</div>}
        <div className="flex justify-end mt-6">
          <button
            data-cy="btn-submit-signup"
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
