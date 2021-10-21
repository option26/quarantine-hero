import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { baseUrl } from '../appConfig';
import { useEmailVerified } from '../util/emailVerified';

export default () => {
  const [sendVerificationSuccess, setSendVerificationSuccess] = useState(false);
  const [user, isAuthLoading] = useAuthState(firebase.auth());
  const [emailVerified, emailVerifiedLoading] = useEmailVerified(firebase.auth());

  const { t } = useTranslation();

  if (!user && !isAuthLoading) {
    return <Redirect to="/signup" />;
  }

  if (user && !emailVerifiedLoading && emailVerified) {
    return <Redirect to="/ask-for-help" />;
  }

  const resendEmail = async (e) => {
    e.preventDefault();
    await user.sendEmailVerification({ url: `${baseUrl}/#/ask-for-help` });
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
    <div className="px-4">
      <h1 className="font-teaser py-4 pt-10">{t('views.verifyEmail.confirmEmail')}</h1>
      <div className="font-open-sans">
        {t('views.verifyEmail.explanation')}
      </div>

      <button type="button" onClick={recheckEmail} className="btn-green w-full mt-8">
        {t('views.verifyEmail.recheckEmail')}
      </button>

      <button type="button" onClick={resendEmail} className="btn-green-secondary w-full mt-4">
        {t('views.verifyEmail.resendEmail')}
      </button>

      {sendVerificationSuccess && <div className="my-5 bg-yellow-100 border rounded p-2 px-4 text-gray-800">{t('views.verifyEmail.resendSuccess')}</div>}
    </div>
  );
};
