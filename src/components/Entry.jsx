import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import fb from '../firebase';
import Responses from './Responses';


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
  const [responsesVisible, setResponsesVisible] = useState(false);

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
            <button type="button" className={`bg-secondary hover:opacity-75 text-white flex-grow ${commonButtonClasses}`} onClick={toggleResponsesVisible}>
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

  const requestCard = (
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
