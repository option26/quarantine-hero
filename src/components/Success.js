import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';


export default function Success () {

  return (<div>
      <div className="mt-8 p-1">
        <p className="text-2xl font-teaser mb-8 text-center">Vielen Dank, wir haben deine Anfrage eingestellt.</p>
        <div className="flex justify-center flex-col items-center mb-8">
          <img className="h-48 w-48 my-10" src={require('../assets/success.svg')}></img>
          <Link className="btn-green" to={'/dashboard'}>ZU DEINER ÜBERSICHT</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
