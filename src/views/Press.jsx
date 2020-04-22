import React from 'react';
import * as Sentry from '@sentry/browser';
import * as firebase from 'firebase/app';
import useCms from '../util/useCms';
import useFirebaseDownload from '../util/useFirebaseDownload';

export default function Press() {
  const [presseLink, errorGeneratingPressLink] = useFirebaseDownload('gs://quarantine-hero-assets/MarketingKit.zip', firebase);
  const [articles] = useCms('press');

  if (errorGeneratingPressLink) {
    Sentry.captureException(errorGeneratingPressLink);
  }

  const Article = ({ date, title, link, text }) => (
    <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full">
      <div className="text-xs text-gray-700">{date}</div>
      <div className="font-bold">{title}</div>
      {link
        ? (
          <a
            className="text-secondary w-full block truncate"
            href={link}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {link}
          </a>
        ) : (
          <span className="w-full block truncate">{text}</span>
        )}
    </div>
  );

  return (
    <div>
      <div className="mt-4 p-4">
        <div className="font-teaser">
          Aktuelle Pressemeldungen und ein Pressekit
        </div>
        <div className="font-open-sans mt-4">
          Neben vielen lokalen Held*innen haben unter anderem diese Medien geholfen, die QuarantäneHeld*innen bekannt zu machen, um noch mehr Hilfesuchende zu
          unterstützen.
          Hier findet Ihr aktuelle Artikel und Nachrichten.
        </div>
        <div className="bg-kaki p-4 mb-10 mt-8 font-open-sans flex">
          <div>
            <img src={require('../assets/clipboard.svg')} alt="Clipboard" className="w-12 mr-4" />
          </div>
          <div>
            <div className="font-bold">
              Presse Informationen
            </div>
            Pressekit (Logos, Pressetext, Grafiken):
            <br className="sm:hidden" />
            {' '}
            <a
              href={presseLink}
              className="text-secondary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              QuarantaeneHeld*innen.zip
            </a>
            <div>
              Pressekontakt:
              <br className="sm:hidden" />
              {' '}
              <a href="mailto:presse@quarantaenehelden.org" className="text-secondary hover:underline">presse@quarantaenehelden.org</a>
            </div>
          </div>
        </div>
        <div className="my-8 flex flex-wrap mb-16">
          <div className="w-1/4 h-auto">
            <img alt="zdf" src={require('../assets/zdf.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="sueddeutsche_zeitung" src={require('../assets/sueddeutsche_zeitung.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="sat1" src={require('../assets/sat1.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="berliner_morgenpost" src={require('../assets/berliner_morgenpost.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="deutschlandfunk" src={require('../assets/deutschlandfunk.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="wdr" src={require('../assets/wdr.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="hr" src={require('../assets/hr.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="br" src={require('../assets/br.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="welt" src={require('../assets/welt.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="focus_online" src={require('../assets/focus_online.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="greenpeace_magazin" src={require('../assets/greenpeace_magazin.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="aktion_mensch" src={require('../assets/aktion_mensch.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="utopia" src={require('../assets/utopia.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="vogue" src={require('../assets/vogue.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="cosmopolitan" src={require('../assets/cosmopolitan.jpg')} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="bunte_de" src={require('../assets/bunte_de.jpg')} />
          </div>
        </div>
        {articles.map((article) => (
          <Article
            key={article.link || article.text}
            date={article.date}
            title={article.title}
            link={article.link}
            text={article.text}
          />
        ))}
        <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full text-center">
          <div className="font-bold">Und viele mehr!</div>
        </div>
      </div>
    </div>
  );
}
