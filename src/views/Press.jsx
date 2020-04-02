import React from 'react';
import Footer from '../components/Footer';

export default function Press() {
  const Article = (props) => (
    <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full">
      <div className="text-xs text-gray-700">{props.date}</div>
      <div className="font-bold">{props.title}</div>
      {props.link
        ? <a className="text-secondary w-full block truncate" href={props.link} target="_blank" rel="nofollow noopener noreferrer">{props.link}</a>
        : <span className="w-full block truncate">{props.text}</span>}
    </div>
  );

  const articles = [
    {
      date: '20.03.2020',
      title: 'ZDF - drehscheibe vom 20. März 2020',
      link: 'https://www.zdf.de/nachrichten/drehscheibe/drehscheibe-vom-20-maerz-2020-100.html',
    },
    {
      date: '19.03.2020',
      title: 'Cosmo',
      text: 'Radiobeitrag',
    },
    {
      date: '19.03.2020',
      title: 'ZDF - Mittagsmagazin vom 19. März 2020 (11:30 min)',
      link: 'https://www.zdf.de/nachrichten/zdf-mittagsmagazin/zdf-mittagsmagazin-vom-19-maerz-2020-100.html',
    },
    {
      date: '19.03.2020',
      title: 'emoition - 37 sinnvolle Ideen gegen Einsamkeit und Langeweile #flattenthecurve',
      link: 'https://www.emotion.de/psychologie-partnerschaft/persoenlichkeit/37-sinnvolle-ideen-gegen-einsamkeit-und-langeweile',
    },
    {
      date: '19.03.2020',
      title: 'ZDF - heute+ vom 19.03.2020 (9:20 min)',
      link: 'https://www.zdf.de/nachrichten/heute-plus/200319-hplus-gesamt-100.html',
    },
    {
      date: '19.03.2020',
      title: 'bigFM -  Nachbarschaftshilfe: So könnt Ihr helfen',
      link: 'https://www.bigfm.de/buzzhaltestelle/30998/nachbarschaftshilfe-hier-koennt-ihr-helfen',
    },
    {
      date: '18.03.2020',
      title: 'BR - Auf diesen Plattformen vernetzt sich ganz Bayern zu praktischer Nachbarschaftshilfe ',
      link: 'https://www.br.de/radio/bayern2/sendungen/zuendfunk/auf-diesen-plattformen-vernetzt-sich-ganz-bayern-zu-praktischer-nachbarschaftshilfe100.html',
    },
    {
      date: '18.03.2020',
      title: 'Hessenschau - Wie sich in der Corona-Zeit Nachbarn gegenseitig unterstützen',
      link: 'https://www.hessenschau.de/gesellschaft/wie-sich-in-der-corona-zeit-nachbarn-gegenseitig-unterstuetzen,nachbarschaftshilfe-corona-100.html',
    },
    {
      date: '17.03.2020',
      title: 'Radio Köln',
      text: 'Interview',
    },
    {
      date: '16.03.2020',
      title: 'rpr1 - RPR1.Corona-Hilfenetzwerk',
      link: 'https://www.rpr1.de/programm/aktion/rpr1corona-hilfenetzwerk',
    },
    {
      date: '16.03.2020',
      title: 'BUNTE.de - Quarantänehelden: So kannst du Menschen in Quarantäne jetzt helfen',
      link: 'https://www.bunte.de/family/bewegende-geschichten/geschichten-des-lebens/gegenseitige-unterstuetzung-organisation-quarantaene-helden-hier-hilft-man-sich-waehrend-der-corona.html',
    },
    {
      date: '16.03.2020',
      title: 'businessinsider.de - So könnt ihr andere Menschen in Zeiten von Corona unterstützen — oder selbst Hilfe bekommen',
      link: 'https://www.businessinsider.de/wirtschaft/verbraucher/so-koennt-ihr-andere-menschen-in-zeiten-von-corona-unterstuetzen-oder-selbst-hilfe-bekommen/',
    },
    {
      date: '16.03.2020',
      title: 'Sat1 Regional - #NachbarschaftsChallenge: Wie Menschen in der Coronavirus-Krise auf andere Weise zusammenrücken',
      link: 'https://www.sat1regional.de/nachbarschaftschallenge-wie-menschen-in-der-coronavirus-krise-zusammenruecken/',
    },
    {
      date: '16.03.2020',
      title: 'Utopia.de - Quarantänehelden: So kannst du Menschen in Quarantäne jetzt helfen',
      link: 'https://utopia.de/quarantaenehelden-corona-virus-helfen-179241/',
    },
  ];

  return (
    <div>
      <div className="mt-4 p-4">
        <div className="font-teaser">
          Aktuelle Pressemeldungen und ein Pressekit
        </div>
        <div className="font-open-sans mt-4">
          Neben vielen lokalen Helden haben unter anderem diese Medien geholfen die QuarantäneHelden bekannt zu machen um noch mehr Hilfesuchende zu
          unterstützen.
          Hier findet ihr aktuelle Artikel und Nachrichten.
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
              href="https://we.tl/t-FhgDBEFBih"
              className="text-secondary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              QuarantaeneHelden.zip
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
        {articles.map((article) => <Article key={article.link || article.text} {...article} />)}
        <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full text-center">
          <div className="font-bold">Und viele mehr!</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
