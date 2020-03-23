import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';

import fb from '../firebase';

export default function Entry(props) {
  const {
    showFullText = false,
    location = '',
    id = '',
    request = '',
    timestamp = Date.now(),
    responses = 0,
    highlightLeft = false,
    reportedBy = [],
  } = props;

  const history = useHistory();
  const { t } = useTranslation();
  const [user] = useAuthState(fb.auth);

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: de }); // @TODO get locale from i18n.language or use i18n for formatting

  const [deleted, setDeleted] = useState('');
  const [attemptingToReport, setAttemptingToReport] = useState(false);

  const userIsLoggedIn = !!user && !!user.uid;
  const userLoggedInAndReportedEntryBefore = userIsLoggedIn && reportedBy.includes(user.uid);
  const [reported, setReported] = useState(userLoggedInAndReportedEntryBefore);


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

  const initializeReportEntry = async (e) => {
    e.preventDefault();
    setAttemptingToReport(true);
  };

  const cancelReportEntry = async (e) => {
    e.preventDefault();
    setAttemptingToReport(false);
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
      return history.push({ pathname, state: { reason_for_registration: 'den Beitrag zu melden' } });
    }

    const data = {
      request,
      askForHelpId: id,
      uid: fb.auth.currentUser.uid,
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

  const style = (highlightLeft)
    ? 'bg-white px-4 py-2 rounded w-full my-3 text-xl block entry border-l-4 border-secondary'
    : 'bg-white px-4 py-2 rounded w-full my-3 text-xl block entry';

  if (deleted) {
    return null;
  }

  const initializeReportEntryButtonClass = reported === false
    ? 'btn-round btn-report-entry-enabled my-2'
    : 'btn-round btn-report-entry-disabled my-2';

  const initializeReportEntryAssetToShow = reported === false
    ? 'flag_red'
    : 'flag_orange';

  return (
    <Link
      to={`/offer-help/${props.id}`}
      className={style}
      key={id}
    >
      <span className="text-xs font-open-sans text-gray-800 mt-2">
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

      {(attemptingToReport === false)
        ? (
          <button type="button" className={initializeReportEntryButtonClass} onClick={initializeReportEntry}>
            {/* eslint-disable-next-line import/no-dynamic-require */}
            <img className="centered-flag" src={require(`../assets/${initializeReportEntryAssetToShow}.svg`)} alt="" />
          </button>
        ) : ''}
      {attemptingToReport
        ? (
          <>
            <button type="button" className="btn-round btn-x-report-entry my-2" onClick={cancelReportEntry}>
              <img className="centered-flag x-btn-flag" src={require('../assets/x.svg')} alt="" />
            </button>
            <button type="button" className="btn-report-entry my-2" onClick={reportEntry}>
              <span className="btn-report-entry-span">
                Post melden?
                <img className="report-entry-flag" src={require('../assets/flag_white.svg')} alt="" />
              </span>
            </button>
          </>
        ) : ''}

      <p className="mt-2 mb-2 font-open-sans text-gray-800">{textToDisplay}</p>
      <div className="flex flex-row justify-between items-center mt-4 mb-2">
        <div className="text-xs text-secondary mr-1 font-bold">{numberOfResponsesText}</div>
        <span className="text-gray-500 inline-block text-right text-xs font-open-sans">
          {t('components.entry.before')}
          {' '}
          {date}
        </span>
      </div>
      {user && (user.uid === props.uid || user.uid === 'gwPMgUwQyNWMI8LpMBIaJcDvXPc2')
        ? (
          <div>
            <button type="button" className="btn-green my-2" onClick={handleDelete}>{t('components.entry.deleteYourRequest')}</button>
          </div>
        ) : ''}
    </Link>
  );
}
