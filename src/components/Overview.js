import React from 'react';
import FilteredList from './FilteredList';
import Footer from './Footer';

export default function AskForHelp () {

  return (<div className="p-4">
      <h1 className="py-4 pt-10 font-teaser">Aktuelle Anfragen</h1>
      <div className="font-open-sans">
        Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
      </div>
      <div className="py-3">
        <FilteredList />
      </div>
      <Footer />
    </div>
  );
}

