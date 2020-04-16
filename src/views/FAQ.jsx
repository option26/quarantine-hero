import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t, i18n } = useTranslation();

  const QAwithLink = (props) => {
    const hasPostLink = i18n.exists(`views.faq.answers.${props.translationKey}.postLink`);
    const postLinkText = t(`views.faq.answers.${props.translationKey}.postLink`);
    const postLinkIsNotEmptyOrFullStop = postLinkText !== '' && postLinkText !== '.';

    return (
      <QA key={props.translationKey} question={t(`views.faq.questions.${props.translationKey}`)}>
        {t(`views.faq.answers.${props.translationKey}.preLink`)}
        <Link to={t(`views.faq.answers.${props.translationKey}.url`)} className="text-secondary hover:underline">
          {' '}
          {t(`views.faq.answers.${props.translationKey}.link`)}
          {hasPostLink && postLinkIsNotEmptyOrFullStop ? ' ' : ''}
        </Link>
        {postLinkText}
      </QA>
    );
  };

  const QA = (props) => (
    <>
      <h2 className="text-xl font-teaser mt-8">{props.question}</h2>
      <p className="font-open-sans">{props.children}</p>
    </>
  );

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
