import { Link } from 'react-router-dom';
import React from 'react';

export default function Main () {


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


  return (<div>
      <div>
        <div className="text-3xl mt-4">wir sind menschen. in zeiten der not helfen wir uns. sei ein teil davon.</div>
      </div>
      <div className="mt-4">
        {entrys.map(entry => {
          return <Link to={`/entry/${entry.id}`} className="p-4 border border-gray-400 rounded w-full m-1 text-xl block" key={entry.id}>
            Jemand in <span className="font-bold">{entry.location}</span> bittet um: <span className="italic">{entry.text}</span><br/>
            <span className="text-gray-500 inline-block text-right w-full text-base">{(new Date(entry.timestamp)).toISOString()}</span>
          </Link>;
        })}
      </div>
    </div>
  );
}

