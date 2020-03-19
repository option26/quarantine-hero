import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import fb from '../firebase';


export default function SuccessOffer() {
  useEffect(() => {
    fb.analytics.logEvent('success_offer_help');
  }, []);

  return (
    <div className="mt-8 p-1">
      <p className="text-2xl font-teaser mb-8 text-center">Vielen Dank, wir haben Deine Nachricht weitergeleitet.</p>
      <div className="flex justify-center flex-col items-center mb-8">
        <img className="h-48 w-48 my-10" src={require('../assets/success.svg')} alt="" />
        <Link className="btn-green mt-10" to="/">ZUR STARTSEITE</Link>
      </div>
      <Footer />
    </div>
  );
}
