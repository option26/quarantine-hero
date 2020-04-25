import React from 'react';
import Rules from '../components/Rules';
import useCms from '../util/useCms';
import Loader from '../components/loader/Loader';
import StyledMarkdown from '../util/StyledMarkdown';

const icons = {
  dont_help: require('../assets/dont_help.svg'),
  local: require('../assets/lokal.svg'),
  distanced: require('../assets/distanziert.svg'),
  consistent: require('../assets/konsistent.svg'),
};

function ContentBlock({ className, title, text, icon }) {
  return (
    <>
      <div className="flex items-center mt-10 mb-2">
        <img className="w-8 h-8 mr-2" src={icons[icon]} alt="" />
        <h3 className="text-xl font-exo2">{title}</h3>
      </div>
      <StyledMarkdown className={className}>{text}</StyledMarkdown>
    </>
  );
}

export default function Security() {
  const [securityRules] = useCms('security-rules');
  const [furtherInformation] = useCms('security-further-info');

  return (
    <div className="px-5 sm:mt-10">
      <h1 className="text-2xl font-exo2">Sicherheitshinweise</h1>
      <div className="text-2xl text-primary font-exo2 italic font-semibold">#sicherhelfen</div>

      <div className="bg-kaki p-4 my-10 font-open-sans">
        <p>
          <span className="font-bold">Haltet Euch an aktuelle Aufforderungen der Behörden!</span>
          &nbsp;Neue Informationen zum Virus und der Lage vor Ort erfordern schnelle Maßnahmen zu unserem Schutz. Nur wenn
          sie von jeder/jedem umgesetzt werden, ist ihre Wirksamkeit gewährleistet!
        </p>
        <div className="mt-4 w-full text-right">
          <button
            type="button"
            className="text-secondary hover:underline"
            onClick={() => {
              document.getElementById('current-news').scrollIntoView();
            }}
          >
            Aktuelle Links &gt;
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-exo2">Die vier Grundregeln</h2>
      <Rules />
      <Loader waitOn={securityRules.length > 0}>
        {securityRules.map((c) => <ContentBlock key={c.title} title={c.title} text={c.text} />)}
      </Loader>

      <h2 id="current-news" className="text-2xl font-exo2 mt-10">Wo informiere ich mich am besten?</h2>
      <Loader waitOn={furtherInformation.length > 0}>
        {furtherInformation.map((i) => <ContentBlock className="leading-relaxed" key={i.title} title={i.title} text={i.text} icon={i.icon} />)}
      </Loader>

      <div className="p-4 bg-kaki font-open-sans mt-10">
        <div className="font-bold">Hinweis</div>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Aktualität und Korrektheit der
        Informationen auf dieser Seite und der Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
        ausschließlich deren Betreiber*innen verantwortlich.
      </div>
    </div>
  );
}
