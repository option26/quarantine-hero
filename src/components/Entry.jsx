import { Link, useHistory } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DoneIcon from '@material-ui/icons/Done';

import fb from '../firebase';
import Responses from './Responses';
import PopupOnEntryAction from './Popup';
import userIsOnMobile from '../util/userIsOnMobile';

import { ReactComponent as QuestionMarkSvg } from '../assets/questionmark.svg';

export default function Entry(props) {
  const {
    showFullText = false,
    showAsSolved = false,
    location = '',
    id = '',
    request = '',
    timestamp = Date.now(),
    responses = 0,
    highlightLeft = false,
    reportedBy = [],
    uid = '',
  } = props;

  const history = useHistory();
  const { t } = useTranslation();
  const [user] = useAuthState(fb.auth);
  const link = useRef(null);
  const isOnMobile = userIsOnMobile();

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: de }); // @TODO get locale from i18n.language or use i18n for formatting
  const [responsesVisible, setResponsesVisible] = useState(false);

  const [deleted, setDeleted] = useState(false);
  const [attemptingToDelete, setAttemptingToDelete] = useState(false);
  const [attemptingToSolve, setAttemptingToSolve] = useState(false);
  const [attemptingToReport, setAttemptingToReport] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const userIsLoggedIn = !!user && !!user.uid;
  const userLoggedInAndReportedEntryBefore = userIsLoggedIn && reportedBy.includes(user.uid);
  const [reported, setReported] = useState(userLoggedInAndReportedEntryBefore);
  const entryBelongsToCurrentUser = userIsLoggedIn && user.uid === uid;
  const collectionName = showAsSolved ? 'solved-posts' : 'ask-for-help';

  let textToDisplay;
  if (showFullText) {
    textToDisplay = request;
  } else if (request.length > 300) {
    textToDisplay = `${request.substring(0, 300)}...`;
  } else {
    textToDisplay = request;
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    const doc = await fb.store.collection(collectionName).doc(props.id).get();
    await fb.store.collection('/deleted').doc(props.id).set({
      collectionName, ...doc.data(),
    });
    setDeleted(true);
    setAttemptingToDelete(false);
    setPopupVisible(true);
  };

  const handleSolved = async (e) => {
    e.preventDefault();
    const askForHelpDoc = await fb.store.collection('ask-for-help').doc(props.id).get();
    const data = askForHelpDoc.data();
    await fb.store.collection('solved-posts').doc(props.id).set(data);
    setDeleted(true);
    setAttemptingToDelete(false);
    setPopupVisible(false);
  };

  const handleNewAskForHelp = async (e) => {
    e.preventDefault();
    setPopupVisible(false);
    return history.push('/ask-for-help');
  };

  const initializeDelete = async (e) => {
    e.preventDefault();
    setAttemptingToDelete(true);
    setPopupVisible(true);
  };

  const initializeSolve = async (e) => {
    e.preventDefault();
    setAttemptingToSolve(true);
    setPopupVisible(true);
  };

  const cancelDelete = async (e) => {
    e.preventDefault();
    setAttemptingToDelete(false);
    setPopupVisible(false);
  };

  const backToOverview = async (e) => {
    e.preventDefault();
    setPopupVisible(false);
  };

  const reportEntry = async (e) => {
    // prevents redirect to the parent component, as this is clicked on a button within a Link component
    // https://stackoverflow.com/a/53005834/8547462
    e.preventDefault();

    const reportedPostsCollection = fb.store.collection('reported-posts');

    // redirect the user to the login page, as we can only store user ids for logged-in users
    if (!userIsLoggedIn) {
      const pathToOfferHelp = `offer-help/${id}`;
      const pathname = `/signin/${encodeURIComponent(pathToOfferHelp)}`;
      setAttemptingToReport(false);
      return history.push({ pathname, state: { reason_for_registration: t('components.entry.registrationReason') } });
    }

    const data = {
      request,
      askForHelpId: id,
      uid: user.uid,
      timestamp: Date.now(),
    };
    await reportedPostsCollection.add(data);
    setAttemptingToReport(false);
    return setReported(true);
  };

  let numberOfResponsesText = '';

  if (responses === 0) {
    numberOfResponsesText = t('components.entry.noRepliesYet');
  } else if (responses === 1) {
    numberOfResponsesText = t('components.entry.oneReplyReceived');
  } else {
    numberOfResponsesText = `${responses} ${t('components.entry.repliesReceived')}`;
  }

  const commonButtonClasses = 'md:px-6 py-2 md:py-3 uppercase font-open-sans font-bold text-center text-xs md:text-sm';

  const popupOnEntryAction = (
    <PopupOnEntryAction
      commonButtonClasses={commonButtonClasses}
      responses={responses}
      attemptingToDelete={attemptingToDelete}
      attemptingToSolve={attemptingToSolve}
      deleted={deleted}
      popupVisible={popupVisible}
      setPopupVisible={setPopupVisible}
      setAttemptingToDelete={setAttemptingToDelete}
      handleSolved={handleSolved}
      showAsSolved={showAsSolved}
      handleNewAskForHelp={handleNewAskForHelp}
      cancelDelete={cancelDelete}
      handleDelete={handleDelete}
      backToOverview={backToOverview}
    />
  );

  if (deleted) {
    // make popup component available to show the success hint, if the entry was previously deleted
    return <>{popupOnEntryAction}</>;
  }

  // eslint-disable-next-line no-nested-ternary
  const buttonClass = reported ? 'btn-report-flagged' : (attemptingToReport ? 'btn-report-abort' : 'btn-report-unflagged');

  const toggleResponsesVisible = (event) => {
    event.preventDefault();
    setResponsesVisible(!responsesVisible);
  };

  const mayDeleteEntryAndSeeResponses = user && (user.uid === props.uid || user.uid === 'gwPMgUwQyNWMI8LpMBIaJcDvXPc2');

  const buttonBar = (() => {
    if (!mayDeleteEntryAndSeeResponses) {
      return <></>;
    }

    const heroFoundButtonClasses = showAsSolved
      ? `bg-secondary text-white ${commonButtonClasses}`
      : `bg-tertiary text-secondary hover:bg-secondary hover:text-white ${commonButtonClasses}`;

    return (
      <div className="flex flex-row mt-2 -mb-2 -mx-4 text-sm rounded-b overflow-hidden">
        {responses === 0
          ? <div className={`bg-gray-200 text-gray-700 pt-3 flex-grow mr-px ${commonButtonClasses}`}>{numberOfResponsesText}</div>
          : (
            <>
              <button type="button" className={`bg-secondary hover:opacity-75 text-white flex-1 ${commonButtonClasses}`} onClick={toggleResponsesVisible}>
                {t('components.entry.message', { count: responses })}
                <MailOutlineIcon className="ml-2 mb-1 inline-block" />
              </button>
              <button type="button" data-cy="btn-entry-solve" className={`md:flex-1 sm:flex-grow mx-px ${heroFoundButtonClasses} px-2`} onClick={initializeSolve} disabled={showAsSolved}>
                {t('components.entry.heroFound')}
                {showAsSolved
                  ? <DoneIcon className="ml-1 mb-1 inline-block" />
                  : <QuestionMarkSvg className="ml-1 mb-1 inline-block" />}
              </button>
            </>
          )}
        <button type="button" data-cy="btn-entry-delete" className={`bg-red-200 text-primary hover:text-white hover:bg-primary ${isOnMobile && 'max-w-5'} ${commonButtonClasses} pl-2 pr-8 md:px-6`} onClick={initializeDelete}>
          {responses === 0 && !isOnMobile ? t('components.entry.deleteRequestForHelp') : null}
          <DeleteOutlineIcon className="mb-1" />
        </button>
      </div>
    );
  })();

  const clearReportAttempt = (e) => {
    if (!link.current.contains(e.target)) setAttemptingToReport(false);
    document.body.removeEventListener('click', clearReportAttempt);
  };

  const requestCard = (
    <>
      <Link
        to={entryBelongsToCurrentUser ? '/dashboard' : `/offer-help/${props.id}`}
        data-id={props.id}
        data-cy={`ask-for-help-entry${responses > 0 ? '-with-responses' : ''}`}
        className={`bg-white px-4 py-2 rounded w-full my-3 text-xl block entry relative ${highlightLeft && 'border-l-4 border-secondary'}`}
        key={id}
        ref={link}
      >
        <div className="flex justify-between">
          <span className="text-xs font-open-sans text-gray-800 mt-2 inline-block">
            {t('components.entry.somebodyAt')}
            {' '}
            <span
              className="font-bold"
            >
              {location}
            </span>
            {' '}
            {t('components.entry.needsHelp')}
          </span>

          {!entryBelongsToCurrentUser ? (
            <button
              type="button"
              className={`btn-round ${!reported && 'hover:opacity-75'} my-2 ml-2 flex items-center justify-center ${buttonClass} z-10 relative`}
              disabled={reported}
              onClick={(e) => {
                e.preventDefault();
                const prevValue = attemptingToReport;
                setAttemptingToReport((curr) => !curr);
                if (!reported && !prevValue) document.body.addEventListener('click', clearReportAttempt);
              }}
            >
              {reported ? <img className="flag" src={require('../assets/flag_orange.svg')} alt="" /> : null}
              {!reported && !attemptingToReport ? <img className="flag" src={require('../assets/flag_red.svg')} alt="" /> : null}
              {!reported && attemptingToReport ? <img className="cross" src={require('../assets/x.svg')} alt="" /> : null}
            </button>
          ) : null}
          {attemptingToReport
            ? (
              <div
                className="absolute inset-0 bg-white-75"
                onClick={(e) => {
                  e.preventDefault();
                  setAttemptingToReport((curr) => !curr);
                }}
              >
                <button
                  type="button"
                  className="flex items-center justify-center hover:opacity-75 font-open-sans btn-report-entry z-10 absolute"
                  onClick={reportEntry}
                >
                  Post melden?
                  <img className="ml-2 inline-block" src={require('../assets/flag_white.svg')} alt="" />
                </button>
              </div>
            ) : null}

        </div>
        <p className="mt-2 mb-2 font-open-sans text-gray-800">{textToDisplay}</p>
        <div className="flex flex-row justify-between items-center mt-4 mb-2">
          <div className="text-xs text-secondary mr-1 font-bold">{mayDeleteEntryAndSeeResponses ? '' : numberOfResponsesText}</div>
          <span className="text-gray-500 inline-block text-right text-xs font-open-sans">
            {t('components.entry.before')}
            {' '}
            {date}
          </span>
        </div>
        {buttonBar}
      </Link>
      {popupOnEntryAction}
    </>
  );

  return (
    <>
      {requestCard}
      {mayDeleteEntryAndSeeResponses && !deleted && responsesVisible
        ? <div className={responsesVisible ? '' : 'hidden'}><Responses id={id} collectionName={collectionName} /></div>
        : <></>}
    </>
  );
}
