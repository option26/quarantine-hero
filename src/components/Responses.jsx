import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import formatDistance from 'date-fns/formatDistance';
import loadResponses from '../services/loadResponses';
import getDateFnsLocaleObject from '../util/getDateFnsLocaleObject';

const Response = ({ response }) => {
  const date = formatDistance(new Date(response.timestamp), Date.now(), { locale: getDateFnsLocaleObject(), addSuffix: true });

  const { t } = useTranslation();

  if (!response.email && !response.answer) {
    return (
      <li className="px-4 py-2 ml-12 mr-1 block relative font-open-sans response">
        <p className="my-2 italic text-gray-800 whitespace-pre-line">{t('components.responses.answerDeleted')}</p>
        <p className="text-gray-500 text-right text-xs">{date}</p>
      </li>
    );
  }

  return (
    <li className="px-4 py-2 ml-12 mr-1 block relative font-open-sans response">
      <div className="flex flex-row flex-wrap items-center mt-2 text-sm">
        <span className="flex-grow text-gray-800 break-all">
          {t('components.responses.answerFrom')}
          {' '}
          <a href={`mailto:${response.email}`} className="font-bold">{response.email}</a>
        </span>
        <a href={`mailto:${response.email}`} className="flex-grow ml-2 text-right text-secondary uppercase">
          <span className="font-bold">{t('components.responses.answer')}</span>
          <span className="ml-1 text-xl leading-0">&raquo;</span>
        </a>
      </div>
      <p className="my-2 text-xl text-gray-800 whitespace-pre-line">{response.answer}</p>
      <p className="text-gray-500 text-right text-xs">{date}</p>
    </li>
  );
};

export default function Responses({ id, collectionName }) {
  const [responses, setResponses] = useState(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    loadResponses(id, collectionName).then(setResponses);
  }, [id, collectionName]);

  return (
    <div>
      {responses === undefined
        ? (
          <p className="my-3 ml-6 font-open-sans text-gray-800">
            {t('components.responses.answersLoading')}
            &hellip;
          </p>
        ) : (
          <ul className="mt-8 mb-12">
            {responses.map((response) => <Response key={response.id} response={response} />)}
          </ul>
        )}
    </div>
  );
}
