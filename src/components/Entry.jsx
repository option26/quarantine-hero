import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import fb from '../firebase';
import Responses from './Responses';

export default function Entry(props) {
  const {
    showFullText = false,
    location = '',
    id = '',
    handleAddressClick = () => {},
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
  const spanLocationRef = useRef(null);

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: de }); // @TODO get locale from i18n.language or use i18n for formatting
  const [responsesVisible, setResponsesVisible] = useState(false);

  const [deleted, setDeleted] = useState('');
  const [attemptingToReport, setAttemptingToReport] = useState(false);

  const userIsLoggedIn = !!user && !!user.uid;
  const userLoggedInAndReportedEntryBefore = userIsLoggedIn && reportedBy.includes(user.uid);
  const [reported, setReported] = useState(userLoggedInAndReportedEntryBefore);
  const entryBelongsToCurrentUser = userIsLoggedIn && user.uid === uid;

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
    const doc = await fb.store.collection('/ask-for-help').doc(props.id).get();
    await fb.store.collection('/deleted').add({
      askForHelpId: doc.id, ...doc.data(),
    });
    fb.store.collection('/ask-for-help').doc(props.id).delete();
    setDeleted(true);
  };

  const reportEntry = async (e) => {
    // prevents redirect to the parent component, as this is clicked on a button within a Link component
    // https://stackoverflow.com/a/53005834/8547462
    e.preventDefault();

    const collectionName = 'reported-posts';
    const reportedPostsCollection = fb.store.collection(collectionName);

    // redirect the user to the login page, as we can only store user ids for logged-in users
    if (!userIsLoggedIn) {
      const pathToOfferHelp = `offer-help/${id}`;
      const pathname = `/signup/${encodeURIComponent(pathToOfferHelp)}`;
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

  const onAddressClick = (event, ref) => {
    event.stopPropagation();
    event.preventDefault();
    const refId = ref.current.id;
    const parentElementId = event.target.id;
    if (refId === parentElementId) {
      handleAddressClick(location, id);
    }
  };

  let numberOfResponsesText = '';

  if (responses === 0) {
    numberOfResponsesText = t('components.entry.noRepliesYet');
  } else if (responses === 1) {
    numberOfResponsesText = t('components.entry.oneReplyReceived');
  } else {
    numberOfResponsesText = `${responses} ${t('components.entry.repliesReceived')}`;
  }

  if (deleted) {
    return null;
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

    const commonButtonClasses = 'px-6 py-3 uppercase font-open-sans font-bold text-center';
    const expandIconProps = {
      className: 'ml-2',
      style: {
        fontSize: '32px', marginTop: '-4px', marginBottom: '-4px', verticalAlign: 'bottom',
      },
    };

    return (
      <div className="flex flex-row mt-4 -mb-2 -mx-4 text-sm rounded-b overflow-hidden">
        {responses === 0
          ? <div className={`bg-gray-200 text-gray-700 flex-grow ${commonButtonClasses}`}>{numberOfResponsesText}</div>
          : (
            <button
              type="button"
              className={`bg-secondary hover:opacity-75 text-white flex-grow ${commonButtonClasses}`}
              onClick={toggleResponsesVisible}
            >
              {responsesVisible ? (
                <>
                  {t('components.entry.hideResponses', { count: responses })}
                  <ExpandLessIcon {...expandIconProps} />
                </>
              ) : (
                <>
                  {t('components.entry.showResponses', { count: responses })}
                  <ExpandMoreIcon {...expandIconProps} />
                </>
              )}
            </button>
          )}
        <button type="button" className={`bg-red-200 text-primary hover:bg-primary hover:text-white ${commonButtonClasses}`} onClick={handleDelete}>
          {t('components.entry.deleteRequestForHelp')}
          <DeleteOutlineIcon style={{ fontSize: '20px' }} className="ml-2" />
        </button>
      </div>
    );
  })();

  const clearReportAttempt = (e) => {
    if (!link.current.contains(e.target)) setAttemptingToReport(false);
    document.body.removeEventListener('click', clearReportAttempt);
  };

  const requestCard = (
    <Link
      to={`/offer-help/${props.id}`}
      className={`bg-white px-4 py-2 rounded w-full my-3 text-xl block entry relative ${highlightLeft && 'border-l-4 border-secondary'}`}
      key={id}
      ref={link}
    >
      <div className="flex justify-between">
        <span className="text-xs font-open-sans text-gray-800 mt-2 inline-block" onClick={(event) => onAddressClick(event, spanLocationRef)}>
          {t('components.entry.somebodyAt')}
          {' '}
          <span
            id="span-location"
            ref={spanLocationRef}
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
  );

  return (
    <>
      {requestCard}
      {mayDeleteEntryAndSeeResponses
        ? <div className={responsesVisible ? '' : 'hidden'}><Responses id={id} /></div>
        : <></>}
    </>
  );
}
