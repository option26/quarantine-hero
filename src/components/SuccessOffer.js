import React from 'react';
import { Link } from 'react-router-dom';


export default function SuccessOffer () {

  return (<div>
      <div className="mt-4 p-1">
        <p className="text-2xl font-semibold">Vielen Dank, wir haben deine Nachricht weitergeleitet.</p>
        <Link className="btn-primary mt-4" to={'/'}>Zur Startseite</Link>
      </div>
    </div>
  );
}
