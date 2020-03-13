import React from 'react';
import { Link } from 'react-router-dom';


export default function Success () {

  return (<div>
      <div className="mt-4 p-1">
        <p className="text-2xl font-semibold">Vielen Dank, wir haben deine Anfrage eingestellt.</p>
        <Link className="btn-primary mt-4" to={'/'}>Zur Startseite</Link>
      </div>
    </div>
  );
}
