import React from 'react';
import './styles/App.css';

function App () {

  const entrys = [
    {
      id: 1,
      location: 'München',
      text: 'Brauche jemand, der für mich einkauft',
      timestamp: Date.now(),
    }, {
      id: 2,
      location: 'München',
      text: 'Brauche jemand, der für mich einkauft',
      timestamp: Date.now(),
    }, {
      id: 3,
      location: 'München',
      text: 'Brauche jemand, der für mich einkauft',
      timestamp: Date.now(),
    }];

  return (
    <div className="flex items-center flex-col">
      <header className="phone-width">
        <h1 className="text-6xl text-center">Quarantine Hero</h1>
      </header>
      <section className="phone-width">
        <div>
          <div className="text-3xl mt-4">wir sind menschen. in zeiten der not helfen wir uns. sei ein teil davon.</div>
        </div>
        <div className="mt-4">
          {entrys.map(entry => {
            return <a className="p-4 border border-gray-400 rounded w-full m-1 text-xl block" href={`/entry/${entry.id}`}>
              Jemand in <span className="font-bold">{entry.location}</span> bittet um: <span className="italic">{entry.text}</span><br/>
              <span className="text-gray-500 inline-block text-right w-full text-base">{(new Date(entry.timestamp)).toISOString()}</span>
            </a>;
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
