import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';


export default function SuccessOffer () {

  return (<div>
      <div className="mt-4 p-1">
        <p className="text-2xl font-teaser mb-8 text-center">Vielen Dank, wir haben Deine Nachricht weitergeleitet.</p>
        <div className="flex justify-center items-center mb-8">
          <Link className="btn-green" to={'/'}>ZUR STARTSEITE</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
