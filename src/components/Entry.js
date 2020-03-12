import { Link } from 'react-router-dom';
import React from 'react';

export default function Entry () {

  const entry = {
    id: 1,
    location: 'München',
    text: 'Brauche jemand, der für mich einkauft',
    timestamp: Date.now(),
  };

  return (<div>
      <div className="mt-4">
        {
          <Link to={`/entry/${entry.id}`} className="p-4 border border-gray-400 rounded w-full m-1 text-xl block">
            Jemand in <span className="font-bold">{entry.location}</span> bittet um: <span className="italic">{entry.text}</span><br/>
            <span className="text-gray-500 inline-block text-right w-full text-base">{(new Date(entry.timestamp)).toISOString()}</span>
          </Link>
        }
      </div>
      <div className="mt-4 w-full">
        <textarea className="border rounded border-gray-400 m-1 p-4 text-xl w-full" placeholder="Ich kann helfen!"/>
      </div>
      <div className="mt-4 m-1 w-full">
        Wenn Sie das abschicken.
      </div>
      <div className="mt-4 m-1 w-full">
        <Link className="btn-primary">Senden</Link>
      </div>
    </div>
  );
}

