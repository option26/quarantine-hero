import { Link } from 'react-router-dom';
import React from 'react';

export default function Footer (props) {
  return (
    <div className="flex justify-center text-sm text-gray-700 mb-4 mt-8 w-full">
        <Link to="/faq">FAQ's</Link>
        <div className="mx-1">|</div>
        <Link to="/impressum">Impressum</Link>
        <div className="mx-1">|</div>
        <Link to="/dsgvo">Datenschutz</Link>
    </div>
  );
}
