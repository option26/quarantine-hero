import React from 'react';
import FilteredList from '../components/FilteredList';
import Footer from '../components/Footer';

export default function AskForHelp() {
  return (
    <div className="p-4">
      <h1 className="py-4 pt-10 font-teaser">Aktuelle Anfragen</h1>
      <div className="font-open-sans">
        Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
      </div>
      <div className="my-4 p-4 flex flex-row justify-start items-center bg-kaki">
        <img className="w-30 h-10 md:h-16 mr-4" src={require('../assets/aushang.svg')} alt="" />
        <p>
          Nicht jeder Mensch hat Internet.
          <br className="sm:hidden" />
          Drucke
          {' '}
          <a href="/assets/aushang.pdf" className="text-secondary hover:underline" download="/assets/aushang.pdf">diesen Aushang</a>
        </p>
      </div>
      <div className="py-3">
        <FilteredList pageSize={20} />
      </div>
      <Footer />
    </div>
  );
}
