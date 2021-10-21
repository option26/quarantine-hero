import { Link, useHistory, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DoneIcon from '@material-ui/icons/Done';

import fb from '../../firebase';
import { maxAllowedRequestForHelp, moreHelpRequestCooldownDays, adminId } from '../../appConfig';
import getDateFnsLocaleObject from '../../util/getDateFnsLocaleObject';
import Responses from '../Responses';
import { ContextMenuPopup, PopupOnEntryAction } from '../Popup';

import { ReactComponent as FlagRedSvg } from '../../assets/flag_red.svg';
import { ReactComponent as FlagWhiteSvg } from '../../assets/flag_white.svg';
import { ReactComponent as FlagOrangeSvg } from '../../assets/flag_orange.svg';
import { ReactComponent as XSymbolSvg } from '../../assets/x.svg';
import { ReactComponent as AddReachSymbolSvg } from '../../assets/add_reach.svg';

import './Entry.css';

export default function Entry(props) {
  const {
    showFullText = false,
    onAddressClick,
    highlightLeft = false,
    report = false,
    entry = undefined,
    showSolveHint = false,
    showDeleteHint = false,
    showMoreHelpHint = false,
  } = props;

  const {
    location = '',
    id = '',
    request = '',
    timestamp = Date.now(),
    responses = 0,
    uid = '',
    lastHelpRequestTimestamps = undefined,
    reportedBy = [],
    solved: showAsSolved,
  } = entry;

  const history = useHistory();
  const windowLocation = useLocation();
  const { t } = useTranslation();
  const [user] = useAuthState(fb.auth);
  const link = useRef(null);

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: getDateFnsLocaleObject(), addSuffix: true });
  const [responsesVisible, setResponsesVisible] = useState(false);

  const [deleted, setDeleted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [moreHelpRequested, setMoreHelpRequested] = useState(false);
  const [moreHelpRequestFailed, setMoreHelpRequestFailed] = useState(false);
  const [requestingMoreHelp, setRequestingMoreHelp] = useState(false);
  const [attemptingToDelete, setAttemptingToDelete] = useState(showDeleteHint);
  const [attemptingToSolve, setAttemptingToSolve] = useState(showSolveHint);
  const [attemptingToReport, setAttemptingToReport] = useState(report);
  const [attemptingToRequestMoreHelp, setAttemptingToRequestMoreHelp] = useState(showMoreHelpHint);
  const [popupVisible, setPopupVisible] = useState(showSolveHint || showDeleteHint || showMoreHelpHint);

  const userIsLoggedIn = !!user && !!user.uid;
  const userLoggedInAndReportedEntryBefore = userIsLoggedIn && reportedBy.includes(user.uid);
  const [reported, setReported] = useState(userLoggedInAndReportedEntryBefore);
  const entryBelongsToCurrentUser = userIsLoggedIn && user.uid === uid;
  const collectionName = showAsSolved ? 'solved-posts' : 'ask-for-help';
  const eligibleToSolve = responses > 0;

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
    const doc = await fb.store.collection(collectionName).doc(id).get();
    await fb.store.collection('/deleted').doc(id).set({
      collectionName, ...doc.data(),
    });
    fb.analytics.logEvent('help_request_deleted');
    setDeleted(true);
    setAttemptingToDelete(false);
    setPopupVisible(true); // trigger the deletion confirmation popup
  };

  const solveEntry = async (e) => {
    e.preventDefault();
    const askForHelpDoc = await fb.store.collection('ask-for-help').doc(id).get();
    const data = askForHelpDoc.data();
    await fb.store.collection('solved-posts').doc(id).set(data);
    fb.analytics.logEvent('help_request_solved');
    setSolved(true);
    setAttemptingToDelete(false);
    setPopupVisible(false);
    return history.replace(windowLocation.pathname);
  };

  const initializeSolve = async (e) => {
    e.preventDefault();
    setAttemptingToSolve(true);
    setPopupVisible(true);
  };

  const handleRequestMoreHelp = async (e) => {
    e.preventDefault();
    try {
      setRequestingMoreHelp(true);
      await fb.askForMoreHelp(id);
      setRequestingMoreHelp(false);
      setMoreHelpRequested(true);
    } catch (err) {
      setRequestingMoreHelp(false);
      setMoreHelpRequestFailed(true);
    }
    fb.analytics.logEvent('more_help_requested');
    setAttemptingToRequestMoreHelp(false);
    setPopupVisible(true);
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

  const initializeMoreHelp = async (e) => {
    e.preventDefault();
    setAttemptingToRequestMoreHelp(true);
    setPopupVisible(true);
  };

  const cancelDelete = async (e) => {
    e.preventDefault();
    setAttemptingToDelete(false);
    setPopupVisible(false);
    return history.replace(windowLocation.pathname);
  };

  const cancelAttemptingToRequestMoreHelp = async (e) => {
    e.preventDefault();
    setAttemptingToRequestMoreHelp(false);
    setPopupVisible(false);
    return history.replace(windowLocation.pathname);
  };

  const backToOverview = async (e) => {
    e.preventDefault();
    setPopupVisible(false);
    return history.replace(windowLocation.pathname);
  };

  const handlePopupClose = () => {
    setAttemptingToDelete(false);
    setPopupVisible(false);
    setMoreHelpRequestFailed(false);
    setMoreHelpRequested(false);
    return history.replace(windowLocation.pathname);
  };

  const handleAddressClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddressClick) {
      onAddressClick(location);
    } else {
      history.push({
        pathname: '/overview',
        search: `?address=${location}`,
      });
    }
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
    fb.analytics.logEvent('help_request_reported');
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

  const popupOnEntryAction = (
    <PopupOnEntryAction
      responses={responses}
      attemptingToDelete={attemptingToDelete}
      attemptingToSolve={attemptingToSolve}
      deleted={deleted}
      popupVisible={popupVisible}
      handlePopupClose={handlePopupClose}
      handleSolved={solveEntry}
      showAsSolved={showAsSolved}
      handleNewAskForHelp={handleNewAskForHelp}
      cancelDelete={cancelDelete}
      handleDelete={handleDelete}
      attemptingToRequestMoreHelp={attemptingToRequestMoreHelp}
      cancelAttemptingToRequestMoreHelp={cancelAttemptingToRequestMoreHelp}
      handleRequestMoreHelp={handleRequestMoreHelp}
      requestingMoreHelp={requestingMoreHelp}
      moreHelpRequested={moreHelpRequested}
      moreHelpRequestFailed={moreHelpRequestFailed}
      backToOverview={backToOverview}
    />
  );

  const contextMenu = (
    <ContextMenuPopup
      initializeSolve={initializeSolve}
      initializeDelete={initializeDelete}
      eligibleToSolve={eligibleToSolve}
      showAsSolved={showAsSolved}
    />
  );

  if (deleted || solved || moreHelpRequested) {
    // make popup component available to show the success hint, if the entry was previously deleted
    return <>{popupOnEntryAction}</>;
  }

  const toggleResponsesVisible = (event) => {
    event.preventDefault();
    setResponsesVisible(!responsesVisible);
  };

  const mayDeleteEntryAndSeeResponses = user && (user.uid === uid || user.uid === adminId);

  const clearReportAttempt = (e) => {
    if (!link.current.contains(e.target)) setAttemptingToReport(false);
    document.body.removeEventListener('click', clearReportAttempt);
  };

  const TopRightButtonBar = (() => {
    // eslint-disable-next-line no-nested-ternary
    const reportButtonClass = reported ? 'btn-report-flagged' : (attemptingToReport ? 'btn-report-abort' : 'btn-report-unflagged');

    // always show the context menu if the entry belongs to the user
    if (entryBelongsToCurrentUser) {
      return contextMenu;
    }

    // else, show the solved hint, if the entry does not belong to the user
    if (showAsSolved) {
      return (
        <div className="flex justify-center items-center bg-secondary text-white text-xs font-medium rounded px-2">
          {t('components.entry.heroFound')}
          <DoneIcon className="ml-1 inline-block" />
        </div>
      );
    }

    // otherwise, show the reporting flag
    return (
      <div>
        <button
          type="button"
          className={`btn-round ${!reported && 'hover:opacity-75'} my-2 ml-2 flex items-center justify-center ${reportButtonClass} z-10 relative`}
          disabled={reported}
          onClick={(e) => {
            e.preventDefault();
            const prevValue = attemptingToReport;
            setAttemptingToReport((curr) => !curr);
            if (!reported && !prevValue) document.body.addEventListener('click', clearReportAttempt);
          }}
        >
          {reported && <FlagOrangeSvg className="flag" alt="" />}
          {!reported && !attemptingToReport && <FlagRedSvg className="flag" alt="" />}
          {!reported && attemptingToReport && <XSymbolSvg className="cross" alt="" />}
        </button>
        {attemptingToReport && (
          <div
            role="button"
            tabIndex="0"
            className="absolute inset-0 bg-white-75"
            onClick={(e) => {
              e.preventDefault();
              setAttemptingToReport((curr) => !curr);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setAttemptingToReport((curr) => !curr);
              }
            }}
          >
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-75 font-open-sans btn-report-entry z-10 absolute"
              onClick={reportEntry}
            >
              {t('components.entry.reportPost')}
              <FlagWhiteSvg className="ml-2 inline-block" />
            </button>
          </div>
        )}
      </div>
    );
  });

  const BottomButtonBar = (() => {
    if (!mayDeleteEntryAndSeeResponses) {
      return <></>;
    }

    const moreHelpEligible = lastHelpRequestTimestamps !== undefined
      ? (lastHelpRequestTimestamps.length < maxAllowedRequestForHelp) && (lastHelpRequestTimestamps.slice(-1)[0] < Date.now() - moreHelpRequestCooldownDays * 24 * 60 * 60 * 1000)
      : false;

    return (
      <div className="flex flex-row mt-2 -mb-2 -mx-4 text-sm rounded-b overflow-hidden">
        {responses === 0
          ? (
            <div className="bg-gray-200 text-gray-700 flex justify-center items-center flex-1 btn-common">
              <div>{numberOfResponsesText}</div>
            </div>
          ) : (
            <button type="button" className="bg-secondary hover:opacity-75 text-white flex-1 btn-common flex flex-row items-center justify-center focus:outline-none" onClick={toggleResponsesVisible}>
              <div className="hidden xs:block">{t('components.entry.message', { count: responses })}</div>
              <MailOutlineIcon className="ml-2 inline-block" />
              <div className="block xs:hidden font-open-sans font-bold ml-1">{responses}</div>
            </button>
          )}
        {!showAsSolved && moreHelpEligible && (
          <button
            type="button"
            data-cy="btn-entry-more-help"
            className="flex items-center justify-center flex-1 sm:flex-grow px-2 ml-px bg-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white btn-common focus:outline-none"
            onClick={initializeMoreHelp}
          >
            <div>{t('components.entry.increaseReach')}</div>
            <AddReachSymbolSvg className="ml-1 inline-block h-4" />
          </button>
        )}
      </div>
    );
  });

  const requestCard = (
    <>
      <Link
        to={entryBelongsToCurrentUser ? '/dashboard' : `/offer-help/${id}`}
        data-id={id}
        data-cy={`ask-for-help-entry${responses > 0 ? '-with-responses' : ''}`}
        className={`bg-white px-4 py-2 rounded w-full my-3 text-xl block entry hyphens-auto relative ${highlightLeft && 'border-l-4 border-secondary'}`}
        key={id}
        ref={link}
      >
        <div className="flex justify-between">
          <span className="text-xs font-open-sans text-gray-800 mt-2 inline-block">
            {t('components.entry.somebodyAt')}
            {' '}
            <button
              type="button"
              onClick={handleAddressClick}
              className="font-bold address-clickable"
            >
              {location}
            </button>
            {' '}
            {t('components.entry.needsHelp')}
          </span>
          <TopRightButtonBar />
        </div>
        <p className="mt-2 mb-2 font-open-sans text-gray-800">{textToDisplay}</p>
        <div className="flex flex-row justify-between items-center mt-4 mb-2">
          <div className="text-xs text-secondary mr-1 font-bold">{mayDeleteEntryAndSeeResponses ? '' : numberOfResponsesText}</div>
          <span className="text-gray-500 inline-block text-right text-xs font-open-sans">{date}</span>
        </div>
        <BottomButtonBar />
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
