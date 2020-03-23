import React from 'react';

export default () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Rule title="Umsichtig" icon={require('../assets/dont_help.svg')}>
      Helft nicht, wenn Ihr einer Risikogruppe angehört! Helft nicht, wenn Ihr Sorge habt selbst eine
      Ansteckungsgefahr
      darzustellen!
    </Rule>

    <Rule title="Lokal" icon={require('../assets/lokal.svg')}>
      Helft in Eurer Nachbarschaft, zum Beispiel Euren Haus-Mitbewohner*innen.
    </Rule>

    <Rule title="Konsistent" icon={require('../assets/konsistent.svg')}>
      Helft nur einem Haushalt, aber das konsistent. Sucht Euch zum Beispiel eine Familie und helft nur dieser.
    </Rule>

    <Rule title="Distanziert" icon={require('../assets/distanziert.svg')}>
      Trefft euch nicht mit anderen Menschen außer denen, denen Ihr helfen wollt. Vermeidet persönlichen Kontakt und
      achtet auf eure eigene Hygiene!
    </Rule>
  </div>
);

const Rule = ({ icon, title, children }) => (
  <div className="mt-5 md:mt-2 md:px-2 flex flex-row md:flex-col md:text-center items-center">
    <img className="w-12 h-12 m-6 md:mb-2 flex-shrink-0" src={icon} alt="" />
    <div>
      <h3 className="font-exo2 text-lg font-semibold">{title}</h3>
      <p className="font-open-sans max-w-xl">
        {children}
      </p>
    </div>
  </div>
);
