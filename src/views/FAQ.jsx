import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

const QA = (props) => (
  <>
    <h2 className="text-xl font-teaser mt-8">{props.question}</h2>
    <p className="font-open-sans">{props.children}</p>
  </>
);

export default function FAQ() {
  const { t } = useTranslation();

  const faqTranslationStringHowTo = [
    'howDoesItWork',
    'whichKindOfRequests',
    'howToPay',
    'howToBeSureMoney',
    'whoCanSeeRequests',
    'howContact',
    'whatToConsider',
    'doIGetPaid',
    'whatAboutSafety',
    'whyShouldI',
    'howDoIKnowQuarantine',
    'howCanIHelp',
  ];

  const faqTranslationStringAboutUs = [
    'whoAreYou',
    'howIsDataUsed',
  ];

  const buildFAQs = (arrayOfKeys) => arrayOfKeys.map((translationString) => (
    <QA key={translationString} question={t(`views.faq.questions.${translationString}`)}>
      {t(`views.faq.answers.${translationString}`)}
    </QA>
  ));

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views:faq.title')}</h1>

      {buildFAQs(faqTranslationStringHowTo)}

      {/* This FAQ needs special treatment because of the link in it. */}
      <QA question={t('views:faq.howHelpPeopleWithoutInternet.question')}>
        {t('views:faq.howHelpPeopleWithoutInternet.answer.preLink')}
        <Link to="/" className="text-secondary hover:underline">
          {' '}
          {t('views:faq.howHelpPeopleWithoutInternet.answer.link')}
          {' '}
        </Link>
        {t('views:faq.howHelpPeopleWithoutInternet.answer.postLink')}
      </QA>

      {buildFAQs(faqTranslationStringAboutUs)}

      <Footer />
    </div>
  );
}
