import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

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

  const buildFAQ = (title, content) => (
    <>
      <h2 className="text-xl font-teaser mt-8">{title}</h2>
      <p className="font-open-sans">{content}</p>
    </>
  );

  const buildFAQs = (arrayOfKeys) => arrayOfKeys.map((translationString) => (
    <>
      {buildFAQ(
        t(`views.faq.questions.${translationString}`),
        t(`views.faq.answers.${translationString}`),
      )}
    </>
  ));

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views.faq.title')}</h1>

      {buildFAQs(faqTranslationStringHowTo)}

      {/* This FAQ needs special treatment because of the link in it. */}
      {buildFAQ(
        t('views.faq.howHelpPeopleWithoutInternet.question'),
        <>
          {t('views.faq.howHelpPeopleWithoutInternet.answer.preLink')}
          <a href="/assets/aushang.pdf" className="text-secondary hover:underline" download="/assets/aushang.pdf">
            {' '}
            {t('views.faq.howHelpPeopleWithoutInternet.answer.link')}
            {' '}
          </a>
          {t('views.faq.howHelpPeopleWithoutInternet.answer.postLink')}
        </>,
      )}

      {buildFAQs(faqTranslationStringAboutUs)}

      <Footer />
    </div>
  );
}
