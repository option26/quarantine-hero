import React from 'react';
import Rules from '../components/Rules';

export default () => (
  <div className="px-5 sm:mt-10">
    <h1 className="text-2xl font-exo2">Sicherheitshinweise</h1>
    <div className="text-2xl text-primary font-exo2 italic font-semibold">#sicherhelfen</div>

    <div className="bg-kaki p-4 my-10 font-open-sans">
      <p>
        <span className="font-bold">Haltet Euch an aktuelle Aufforderungen der Behörden!</span>
        &nbsp;Neue Informationen zum Virus und der Lage vor Ort erfordern schnelle Maßnahmen zu unserem Schutz. Nur wenn
        sie von
        jeder/jedem umgesetzt werden, ist ihre Wirksamkeit gewährleistet!
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
    <div className="flex items-center mt-10 mb-2">
      <img className="w-8 h-8 mr-2" src={require('../assets/dont_help.svg')} alt="dont help" />
      <h3 className="text-xl font-exo2">Umsichtig</h3>
    </div>
    <div className="font-open-sans">
      <span className="font-bold">Helft nicht, wenn Ihr einer Risikogruppe angehört!</span>
      <br />
      Zu den besonders gefährdeten Personengruppen zählen:
      <ul className="list-disc ml-5">
        <li className="mt-1">ältere Personen (mit stetig steigendem Risiko ab etwa 50 bis 60 Jahren)</li>
        <li className="mt-1">
          Personen mit bestimmten Vorerkrankungen (z.B. des Herzens, der Lunge, Diabetes Mellitus, Krebserkrankung)
        </li>
        <li className="mt-1">
          Personen mit geschwächtem Immunsystem (z.B. durch Medikamente wie Cortison)
        </li>
        <li className="mt-1">
          Rauchende
        </li>
      </ul>
    </div>

    <div className="mt-5 font-open-sans">
      <span className="font-bold">
        Helft nicht, wenn Ihr Sorge habt, selbst eine Ansteckungsgefahr darzustellen!
      </span>
      <br />
      Eine Ansteckungsgefahr besteht nicht nur durch das Coronavirus sondern auch durch andere Krankheiten (z.B.
      Grippe). Daher bleibt bitte zu Hause, wenn
      <ul className="list-disc ml-5">
        <li className="mt-1"> Ihr aktuell Krankheitssymptome habt, wie z.B. Fieber, Husten oder Atemnot,</li>
        <li className="mt-1">
          Ihr persönlichen Kontakt zu einer im Labor nachgewiesenen mit SARS-CoV-2 infizierten Person hattet,
        </li>
        <li className="mt-1">
          Ihr in den letzten 14 Tagen in einem internationalen Risikogebiet bzw. einem in Deutschland besonders
          betroffenen
          Gebiet wart! Eine aktuelle Liste dieser Gebiete findet Ihr auf der
          <a
            className="text-secondary hover:underline"
            href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Homepage des Robert
            Koch Instituts.
          </a>
        </li>
      </ul>
    </div>

    <div className="flex items-center mt-10 mb-2">
      <img className="w-8 h-8 mr-2" src={require('../assets/lokal.svg')} alt="local" />
      <h3 className="text-xl font-exo2">Lokal</h3>
    </div>
    <p className="font-open-sans">
      Helft in Eurer Nachbarschaft, zum Beispiel Euren Haus-Mitbewohner*innen. Vermeidet also, längere Strecken
      unterwegs zu sein oder anderen Menschen zu begegnen, um die Möglichkeit einer Ansteckung gering zu halten. So
      schützt Ihr nicht nur Euch, sondern vor allem die Personen, um die Ihr Euch kümmert!
    </p>

    <div className="flex items-center mt-10 mb-2">
      <img className="w-8 h-8 mr-2" src={require('../assets/konsistent.svg')} alt="consistent" />
      <h3 className="text-xl font-exo2">Konsistent</h3>
    </div>
    <div className="font-open-sans">
      <div className="font-bold">Sucht Euch EINEN Haushalt in Eurer Nähe, der Hilfe braucht!</div>
      Es ist wichtig, potentielle Infektionsketten möglichst gering zu halten (insbesondere wenn ein persönlicher
      Kontakt nicht vermeidbar ist, z.B. bei der Betreuung von Kindern). Helft daher nach Möglichkeit nur einem Haushalt
      und vermeidet sonstige soziale Kontakte.
    </div>

    <div className="flex items-center mt-10 mb-2">
      <img className="w-8 h-8 mr-2" src={require('../assets/distanziert.svg')} alt="distanced" />
      <h3 className="text-xl font-exo2">Distanziert</h3>
    </div>
    <div className="font-open-sans">
      <div className="font-bold">Trefft klare Absprachen und vermeidet persönlichen Kontakt!</div>
      Die größte Ansteckungsgefahr besteht bei einem direkten Kontakt mit einer Person im Abstand von weniger als zwei Metern
      oder durch den Kontakt mit Tröpfchen beim Niesen oder Husten. Besprecht daher am Telefon, in sozialen Medien
      o.ä.
      was genau benötigt wird und wie Übergaben (Geld, Arzneimittelrezepte, Einkäufe etc.) kontaktlos erfolgen
      können.

      <div className="font-bold mt-5">Achtet auf Eure eigene Hygiene!</div>
      Wascht Euch regelmäßig und ausreichend lang (min. 20 Sek.) die Hände. Vor allem vor dem Trinken oder Essen und
      nach dem Kontakt mit Haustieren oder Türklinken. Versucht Euch nicht ins Gesicht zu fassen und desinfiziert
      häufig
      genutzte Gegenstände, wie Euer Handy.

      <div className="mt-5">
        <span className="font-bold">Tragt Einweg-Handschuhe,</span>
        {' '}
        wenn Ihr Gegenstände von mit SARS-CoV-2
        infizierten Personen entgegennehmt.
      </div>

      <div className="font-bold mt-5">Haltet Abstand zu anderen Leuten!</div>
      Versucht einen Abstand von mindestens zwei Metern zu anderen Personen einzuhalten und vermeidet direkten Körperkontakt
      wie
      Umarmungen oder Händeschütteln.

      <div className="font-bold mt-5">Haltet die Hustenetikette ein!</div>
      Hustet oder niest nur in Eure Ellenbeuge oder in ein Taschentuch, das danach entsorgt wird. Bittet auch Personen
      in
      Eurem Umkreis, dies zu tun.
    </div>

    <div className="p-4 bg-kaki font-open-sans mt-5">
      <div className="font-bold">Hinweis</div>
      Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Aktualität und Korrektheit der
      Informationen auf dieser Seite und der Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
      ausschließlich deren Betreiber*innen verantwortlich.
    </div>

    <div className="mt-5">
      <div className="font-bold font-open-sans">Quellen</div>
      <span className="font-open-sans mt-2">
        <a
          className="text-secondary hover:underline block"
          href="https://www.arbsi.uni-wuppertal.de/index.php?id=4908"
          target="_blank"
          rel="noopener noreferrer"
        >
          Handlungshilfen für den Einsatz von Spontanhelfenden im Rahmen des Coronavirus (SARS-CoV-2); Bergische Universität Wuppertal
        </a>
        <a
          className="text-secondary hover:underline block mt-2"
          href="https://bit.ly/3a405f7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Solidarität in Zeiten des COVID-19: Wie man richtig hilft; Ben F. Meier
        </a>
      </span>
    </div>

    <h2 id="current-news" className="text-2xl font-exo2 mt-10">Wo informiere ich mich am besten?</h2>
    <div className="font-open-sans">
      <h3 className="text-xl font-exo2 mt-3">Deutschland</h3>
      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.infektionsschutz.de/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Aktuelle
        Informationen der Bundeszentrale für gesundheitliche Aufklärung
      </a>
      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.bundesregierung.de/breg-de/themen/coronavirus"
        target="_blank"
        rel="noopener noreferrer"
      >
        Informationen der Bundesregierung zum
        Coronavirus
      </a>
      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.bundesregierung.de/resource/blob/975226/1733246/e6d6ae0e89a7ffea1ebf6f32cf472736/2020-03-22-mpk-data.pdf?download=1"
        target="_blank"
        rel="noopener noreferrer"
      >
        Kontaktverbot Bundesregierung
      </a>

      <h3 className="text-xl font-exo2 mt-3">Österreich</h3>
      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Aktuelle-Ma%C3%9Fnahmen.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Aktuelle Informationen der Bundesregierung zum Coronavirus
      </a>

      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.sozialministerium.at/dam/jcr:aca0d8db-a2c6-46bd-bf07-b04cd187fd84/Verordnung_V20200319_Ansicht.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ausgangssperre Österreich
      </a>

      <h3 className="text-xl font-exo2 mt-3">Schweiz</h3>
      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.bag.admin.ch/bag/de/home/krankheiten/ausbrueche-epidemien-pandemien/aktuelle-ausbrueche-epidemien/novel-cov.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Aktuelle Informationen des Bundesamt für Gesundheit:
      </a>

      <a
        className="block mt-1 hover:underline text-secondary"
        href="https://www.admin.ch/opc/de/classified-compilation/20200744/index.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Verordnung des Schweizerischen Bundesrats über Maßnahmen des Coronavirus
      </a>
    </div>
  </div>
);
