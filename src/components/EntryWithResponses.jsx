import React, { useEffect, useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { de } from 'date-fns/locale';
import Entry from './Entry';
import fb from '../firebase';

const loadResponses = async (requestForHelpId) => {
  const request = fb.store.collection('ask-for-help').doc(requestForHelpId).collection('offer-help').orderBy('timestamp', 'asc');
  const querySnapshot = await request.get();
  return querySnapshot.docs.map((docSnapshot) => ({ ...docSnapshot.data(), id: docSnapshot.id }));
};

const Response = ({ response }) => {
  const date = formatDistance(new Date(response.timestamp), Date.now(), { locale: de });

  return (
    <li className="px-4 py-2 my-1 block relative ml-12 font-open-sans response">
      <div className="flex flex-row justify-between items-center mt-2 text-sm">
        <span className="text-gray-800">
          {'Antwort von '}
          <a href={`mailto:${response.email}`} className="font-bold">{response.email}</a>
        </span>
        <a href={`mailto:${response.email}`} className="text-secondary uppercase">
          <span className="font-bold">Antworten</span>
          <span className="ml-1 text-xl leading-0">&raquo;</span>
        </a>
      </div>
      <p className="mt-2 mb-2 text-xl text-gray-800 whitespace-pre-line">{response.answer}</p>
      <p className="text-gray-500 text-right text-xs">
        vor
        {' '}
        {date}
      </p>
    </li>
  );
};

export default function EntryWithResponses(props) {
  const [responses, setResponses] = useState(undefined);

  useEffect(() => {
    loadResponses(props.id).then(setResponses);
  }, [props.id]);

  return (
    <div>
      <Entry {...props} />
      {responses === undefined
        ? <p className="my-3 ml-6 font-open-sans text-gray-800">Antworten werden geladen &hellip;</p>
        : (
          <ul className="mt-8 mb-12">
            {responses.map((response) => <Response key={response.id} response={response} />)}
          </ul>
        )}
    </div>
  );
}
