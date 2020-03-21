import React, { useEffect, useState } from 'react';
import ReplyIcon from '@material-ui/icons/Reply';
import Entry from './Entry';
import fb from '../firebase';

const loadResponses = async (requestForHelpId) => {
  const request = fb.store.collection('ask-for-help').doc(requestForHelpId).collection('offer-help').orderBy('timestamp', 'asc');
  const querySnapshot = await request.get();
  return querySnapshot.docs.map((docSnapshot) => ({ ...docSnapshot.data(), id: docSnapshot.id }));
};

const Response = ({ response }) => (
  <a href={`mailto:${response.email}`} className="bg-gray-200 px-4 py-2 rounded my-3 text-xl block relative ml-8 response">
    <ReplyIcon style={{ fontSize: '24px' }} className="text-gray-600 absolute -left-8" />
    <span className="text-xs font-open-sans text-gray-800 mt-2">
      {'Antwort von '}
      <span className="font-bold">{response.email}</span>
    </span>
    <p className="mt-2 mb-2 font-open-sans text-gray-800 whitespace-pre-line">{response.answer}</p>
  </a>
);

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
        : responses.map((response) => <Response key={response} response={response} />)}
    </div>
  );
}
