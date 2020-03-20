import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

export default function FAQ() {
  const { t } = useTranslation();

  const faqTranslationString = [
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
    'howCanIHelp'
  ];

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('faq.title')}</h1>

      {faqTranslationString.map((translationString) => (
        <>
          <h2 className="text-xl font-teaser mt-8">{t(`faq.questions.${translationString}`)}</h2>
          <p className="font-open-sans">{t(`faq.answers.${translationString}`)}</p>
        </>
      ))}


      <h2 className="text-xl font-teaser mt-8">Wie kann ich Leuten helfen, die kein Internet haben?</h2>
      <p className="font-open-sans">
                Du kannst auch einen Aushang im Treppenhaus deiner Wohnung aufhängen. Eine Vorlage
                haben wir dir&nbsp;
        <a href="/assets/aushang.pdf" className="text-secondary hover:underline" download="/assets/aushang.pdf">
                    hier
                    zum Download
        </a>
        {' '}
                bereitgestellt
      </p>
      <h2 className="text-xl font-teaser mt-8">Wer seid ihr?</h2>

      <p className="font-open-sans">
                Wir sind Andy, Florian, Henrike, Jakob, Julia, Keno, Nicolai, Milena, Philipp und Sophie, eine Gruppe
                von Freunden, die mit diesem
                Projekt ihren kleinen Beitrag
                leisten und Menschen helfen möchten.
      </p>

      <h2 className="text-xl font-teaser mt-8">Wie werden Daten verwendet?</h2>

      <p className="font-open-sans">
                Wenn du eine Anfrage stellst, wird diese öffentlich (ohne deine E-Mail) an alle Nutzer gezeigt.
                Wenn Du eine Anfrage beantwortest, wird deine Antwort und deine E-Mail Adresse an den Anfragensteller
                geschickt.
      </p>
      <Footer />
    </div>
  );
}
