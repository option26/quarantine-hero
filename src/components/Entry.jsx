import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
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
  const [reported, setReported] = useState(false);
  const history = useHistory();

  const date = formatDistance(new Date(timestamp), Date.now(), { locale: de });

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
    if (!fb.auth.currentUser || !fb.auth.currentUser.uid) {
      const pathToOfferHelp = `offer-help/${id}`;
      const pathname = `/signup/${encodeURIComponent(pathToOfferHelp)}`;
      return history.push({ pathname, state: { reason_for_registration: 'den Beitrag zu melden' } });
    }
    const data = {
      request,
      post_id: id,
      u_id: fb.auth.currentUser.uid,
      timestamp: Date.now(),
    };
    await reportedPostsCollection.add(data);
    setReported(true);
  };

  let numberOfResponsesText = '';

  if (responses === 0) {
    numberOfResponsesText = 'Noch keine Antworten erhalten';
  } else if (responses === 1) {
    numberOfResponsesText = '1 Antwort erhalten';
  } else {
    numberOfResponsesText = `${responses} Antworten erhalten`;
  }

  const style = (highlightLeft)
    ? 'bg-white px-4 py-2 rounded w-full my-3 text-xl block entry border-l-4 border-secondary'
    : 'bg-white px-4 py-2 rounded w-full my-3 text-xl block entry';

  if (deleted) {
    return null;
  }

  const reportEntryButtonClass = reported === false
    ? 'btn-report-entry btn-report-entry-enabled my-2'
    : 'btn-report-entry btn-report-entry-disabled my-2';

  const buttonText = reported === false
    ? 'Melden'
    : 'Gemeldet!';

  return (
    <Link
      to={`/offer-help/${props.id}`}
      className={style}
      key={id}
    >
      <span className="text-xs font-open-sans text-gray-800 mt-2">
        Jemand in
        {' '}
        <span
          className="font-bold"
        >
          {location}
        </span>
        {' '}
        braucht Hilfe!
      </span>
      <button type="button" className={reportEntryButtonClass} onClick={reportEntry}>{buttonText}</button>
      <p className="mt-2 mb-2 font-open-sans text-gray-800">{textToDisplay}</p>
      <div className="flex flex-row justify-between items-center mt-4 mb-2">
        <div className="text-xs text-secondary mr-1 font-bold">{numberOfResponsesText}</div>
        <span className="text-gray-500 inline-block text-right text-xs font-open-sans">
          vor
          {' '}
          {date}
        </span>
      </div>
      {fb.auth.currentUser && ((fb.auth.currentUser.uid === props.uid) || fb.auth.currentUser.uid === 'gwPMgUwQyNWMI8LpMBIaJcDvXPc2')
        ? (
          <div>
            <button type="button" className="btn-green my-2" onClick={handleDelete}>Deine Anfrage löschen.</button>
          </div>
        ) : ''}
    </Link>
  );
}
