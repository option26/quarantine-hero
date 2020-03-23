import { Link } from 'react-router-dom';
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
  } = props;

  const [deleted, setDeleted] = useState('');

  const { t } = useTranslation();
  const [user] = useAuthState(fb.auth);

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: de }); // @TODO get locale from i18n.language or use i18n for formatting

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
        !
      </span>
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
