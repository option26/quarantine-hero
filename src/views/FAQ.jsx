import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

export default function FAQ() {
  const { t, i18n } = useTranslation();

  const QAwithLink = ({ translationKey }) => {
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
  };

  const QA = (props) => {
    const {
      question,
      children,
    } = props;

    return (
      <>
        <h2 className="text-xl font-teaser mt-8">{question}</h2>
        <p className="font-open-sans">{children}</p>
      </>
    );
  };

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
      <Footer />
    </div>
  );
}
