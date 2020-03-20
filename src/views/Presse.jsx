import React from 'react';
import Footer from '../components/Footer';

export default function Presse() {
  const Article = (props) => (
    <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full">
      <div className="text-xs text-gray-700">{props.date}</div>
      <div className="font-bold">{props.title}</div>
      <a className="text-secondary w-full block truncate" href={props.link} target="_blank" rel="nofollow noopener noreferrer">{props.link}</a>
    </div>
  );

  const articles = [
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
          Neben vielen lokalen Helden haben unter anderem diese Medien geholfen die QuarantäneHelden bekannt zu machen um noch mehr Hilfesuchende zu unterstützen.
          Hier findet ihr aktuelle Artikel und Nachrichten.
        </div>
        <div className="bg-kaki p-4 mb-10 mt-8 font-open-sans flex items-center rounded">
          <div>
            <img src={require('../assets/clipboard.svg')} alt="Clipboard" className="w-12 mr-4" />
          </div>
          <div>
            <div className="font-bold">
              Pressekit Download
            </div>
            Logos, Pressetext, Grafiken
            <div>
              <a href="https://we.tl/t-FhgDBEFBih" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">QuarantaeneHelden.zip</a>
            </div>
          </div>
        </div>
        <div className="my-8 flex flex-wrap mb-16">
          <div className="w-1/3 h-auto">
            <img alt="bunte" src={require('../assets/bunte_de.jpg')} />
          </div>
          <div className="w-1/3 h-auto">
            <img alt="businessinsider" src={require('../assets/business_insider.jpg')} />
          </div>
          <div className="w-1/3 h-auto">
            <img alt="rpr1" src={require('../assets/rpr1.jpg')} />
          </div>
          <div className="w-1/3 h-auto">
            <img alt="sat1 regional" src={require('../assets/sat1_regional.jpg')} />
          </div>
          <div className="w-1/3 h-auto">
            <img alt="utopia" src={require('../assets/utopia.jpg')} />
          </div>
          <div className="w-1/3 h-auto">
            <img alt="youfm" src={require('../assets/youfm.jpg')} />
          </div>
        </div>
        {articles.map((article) => <Article {...article} key={article.link} />)}
        <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full text-center">
          <div className="font-bold">Und viele mehr!</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
