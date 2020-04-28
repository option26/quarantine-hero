import React from 'react';
import { Link } from 'react-router-dom';

export default function StatusIndicator(props) {
  const {
    text,
    continueURL = '/',
    continueText = 'Zur StartSeite',
    success = true,
  } = props;

  const imgSource = success ? require('../assets/success.svg') : require('../assets/error.svg');

  return (
    <div>
      <div className="mt-8 p-1">
        <p className="text-2xl font-teaser mb-8 text-center">{text}</p>
        <div className="flex justify-center flex-col items-center mb-8">
          <img className="h-48 w-48 my-10" src={imgSource} alt="" />
          <Link className="btn-green mt-10" to={continueURL}>{continueText}</Link>
        </div>
      </div>
    </div>
  );
}
