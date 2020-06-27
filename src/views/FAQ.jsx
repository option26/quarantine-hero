import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function FAQ() {
  const { t, i18n } = useTranslation();

  function buildFAQ(translationString) {
    return (i18n.exists(`views.faq.answers.${translationString}.preLink`))
      ? <QAwithLink key={translationString} translationKey={translationString} />
      : <QA key={translationString} question={t(`views.faq.questions.${translationString}`)}>{t(`views.faq.answers.${translationString}`)}</QA>;
  }

  function buildFAQs(arrayOfKeys) {
    return arrayOfKeys.map((translationString) => buildFAQ(translationString));
  }

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views.faq.title')}</h1>
      {buildFAQs(Object.keys(t('views.faq.questions', { returnObjects: true })))}
    </div>
  );
}

function QA({ question, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-4 mb-1 px-4 py-2 flex justify-start items-center bg-kaki w-full focus:outline-none"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <div className="font-semibold text-left mr-4">{question}</div>
        <div className="flex-1" />
        {
          React.createElement((isOpen ? ExpandLessIcon : ExpandMoreIcon), {
            className: 'cursor-pointer hover:opacity-50',
            style: { fontSize: '40px' },
          })
        }
      </button>
      <Collapse in={isOpen}>
        <div className="p-4 bg-kaki">
          {children}
        </div>
      </Collapse>
    </>
  );
}

function QAwithLink({ translationKey }) {
  const { t, i18n } = useTranslation();

  const hasPostLink = i18n.exists(`views.faq.answers.${translationKey}.postLink`);
  const postLinkText = t(`views.faq.answers.${translationKey}.postLink`);
  const postLinkIsNotEmptyOrFullStop = postLinkText !== '' && postLinkText !== '.';

  return (
    <QA key={translationKey} question={t(`views.faq.questions.${translationKey}`)}>
      {t(`views.faq.answers.${translationKey}.preLink`)}
      <Link to={t(`views.faq.answers.${translationKey}.url`)} className="text-secondary hover:underline">
        {' '}
        {t(`views.faq.answers.${translationKey}.link`)}
        {hasPostLink && postLinkIsNotEmptyOrFullStop ? ' ' : ''}
      </Link>
      {postLinkText}
    </QA>
  );
}
