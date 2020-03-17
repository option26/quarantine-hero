import React from 'react';
import Footer from '../components/Footer';

export default function Presse () {

  const Article = (props) => {
    return (
      <div className="bg-kaki p-4 mb-6 mt-4 font-open-sans w-full">
        <div className="text-xs text-gray-700">{props.date}</div>
        <div className="font-bold">{props.title}</div>
        <a className="text-secondary w-full block truncate" href={props.link} target="_blank" rel="nofollow noopener noreferrer">{props.link}</a>
      </div>
    )
  };

  const articles = [
    {
      date: '17.03.2020',
      title: 'BUNTE - Menschlichkeit in Corona Zeiten, junge Menschen helfen.',
      link: 'https://www.bunte.de/asdfgasewrgfaerghasergasergasergaserg'
    }
  ];

  return (<div>
      <div className="mt-4 p-4">
        <div className="font-teaser">
          Aktuelle Pressemeldungen und ein Pressekit
        </div>
        <div className="font-open-sans mt-4">
          Neben vielen lokalen Helden haben unter anderem diese Medien geholfen die QuarantäneHelden bekannt zu machen um noch mehr Hilfesuchende zu unterstützen.
          Hier findet ihr aktuelle Artikel und Nachrichten.
        </div>
        <div className="bg-kaki p-4 mb-6 mt-4 font-open-sans flex">
          <div>
            <img src={require('../assets/clipboard.svg')} alt="Clipboard" className="w-12 mr-4" />
          </div>
          <div>
            <div className="font-bold">
              Pressekit Download
            </div>
            Logos, Pressetext, Grafiken
            <div>
              <a href='/assets/aushang.pdf' className="text-secondary hover:underline" download="/assets/aushang.pdf">QuarantaeneHelden.zip</a>
            </div>
          </div>
        </div>
        {articles.map(article => <Article {...article} key={article.link} />)}
        <Footer/>
      </div>
    </div>
  );
}
