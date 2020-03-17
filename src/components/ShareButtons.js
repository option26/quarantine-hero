import React from 'react';

export default function ShareButtons(props) {

  const linkToShare = "https://www.quarantaenehelden.org/";

  return (
    <div className="flex item">
      <div className="mx-2 cursor-pointer">
        <a href='https://instagram.com/quarantaenehelden' target='_blank'>
          <img src={require('../assets/ig.svg')} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
      <div className="mx-2 cursor-pointer">
        <a href='https://twitter.com/QuarantaneH' target='_blank'>
          <img src={require('../assets/fb.svg')} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
      <div className="mx-2 cursor-pointer">
        <a href='https://twitter.com/QuarantaneH' target='_blank'>
          <img src={require('../assets/tw.svg')} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
    </div>
  );
}
