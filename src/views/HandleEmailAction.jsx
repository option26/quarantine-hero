import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase';
import Loader from '../components/loader/Loader';

export default function HandleEmailAction() {
  const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
  const mode = urlParams.get('mode');
  const continueUrl = urlParams.get('continueUrl');
  const actionCode = urlParams.get('oobCode');

  switch (mode) {
    case 'verifyEmail': return <VerifyEmailView continueUrl={continueUrl} actionCode={actionCode} />;
    case 'resetPassword': return <ResetPasswordView continueUrl={continueUrl} actionCode={actionCode} />;
    case 'recoverEmail': return <RecoverEmailView continueUrl={continueUrl} actionCode={actionCode} />;
    default: return <div>error</div>;
  }
}

function VerifyEmailView({ continueUrl, actionCode }) {
  const [loading, setLoading] = useState(true);
  const [user, isAuthLoading] = useAuthState(firebase.auth());

  const history = useHistory();

  const verifyEmail = async () => {
    try {
      await firebase.auth().applyActionCode(actionCode);

      history.push(continueUrl);
    } catch (err) {
      setLoading(false);
    }
  };

  const resendVerificationLink = () => {
    if (user) {
      user.sendEmailVerification();
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <Loader waitOn={!loading}>
      <div>Error during email verification</div>
      {user && !isAuthLoading && <button type="button" onClick={resendVerificationLink}>Resend link</button>}
    </Loader>
  );
}

function ResetPasswordView({ continueUrl, actionCode }) {
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const passwordInput = useRef();
  const passwordRepeatInput = useRef();

  const history = useHistory();

  const verifyToken = async () => {
    try {
      await firebase.auth().verifyPasswordResetCode(actionCode);
    } catch (err) {
      setTokenInvalid(true);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    await verifyToken();

    if (tokenInvalid) return;

    try {
      await firebase.auth().confirmPasswordReset(actionCode, password);
    } catch (err) {
      switch (err) {
        case 'auth/expired-action-token': setTokenInvalid(true); break;
        case 'auth/invalid-action-token': setTokenInvalid(true); break;
        case 'auth/weak-password': setError('Pw too short'); break; // TODO i18n
        default: setError(err.message);
      }
    }

    history.push(continueUrl);
  };

  const comparePasswords = () => {
    if (passwordInput.current.value !== passwordRepeatInput.current.value) {
      passwordRepeatInput.current.setCustomValidity("Passwords don't match"); //TODO i18n
    } else {
      passwordRepeatInput.current.setCustomValidity('');
    }
  };

  useEffect(() => verifyToken(), [actionCode]);


  if (tokenInvalid) {
    return (
      <div>Error invalid token</div>
    );
  }

  return (
    <>
      <h3 className="text-xl">Reset Password //TODO i18n</h3>
      <form onSubmit={resetPassword}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password">
            Passwort // TODO i18n
          </label>
          <input
            ref={passwordInput}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password"
            type="password"
            placeholder="Neues passwort" // TODO i18n
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
            Passwort wiederholen // TODO i18n
          </label>
          <input
            ref={passwordRepeatInput}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
            id="password_repeat"
            type="password"
            autoComplete="new-password"
            placeholder="Passwort bestätigen" // TODO i18n
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
            Passwort ändern // TODO i18n
          </button>
        </div>
      </form>
    </>
  );
}

function RecoverEmailView({ continueUrl, actionCode }) {
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [recoveredEmail, setRecoveredEmail] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState(false);

  const history = useHistory();

  const verifyToken = async () => {
    try {
      const tokenInfo = await firebase.auth().verifyPasswordResetCode(actionCode);
      return tokenInfo.data.email;
    } catch (err) {
      setTokenInvalid(true);
      return null;
    }
  };

  const resetEmail = async () => {
    try {
      await firebase.auth().applyActionCode(actionCode);

      setResetSuccess(true);
    } catch (err) {
      switch (err) {
        case 'auth/expired-action-token': setTokenInvalid(true); break;
        case 'auth/invalid-action-token': setTokenInvalid(true); break;
        case 'auth/weak-password': setError('Pw too short'); break; // TODO i18n
        default: setError(err.message);
      }
    }
  };

  const sendPwResetLink = async () => {

  };

  useEffect(() => {
    const onInit = async () => {
      setRecoveredEmail(await verifyToken());
    };

    onInit();
  }, [actionCode]);


  if (tokenInvalid) {
    return (
      <div>Error invalid token</div>
    );
  }

  if (error) {
    return (
      <div>
        An error occured
        {` ${error} `}
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div>
        Do you also want to reset your password?
        <button type="button" onClick={sendPwResetLink}>Yes, send me a reset link</button>
        <button type="button" onClick={history.push(continueUrl)}>No, only continue</button>
      </div>
    );
  }

  return (
    <div>
      Do you want to revert your email back to
      {` ${recoveredEmail} `}
      ?
      <button type="button" onClick={resetEmail}>Reset Email</button>
    </div>
  );
}
