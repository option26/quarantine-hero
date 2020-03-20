import { Link } from 'react-router-dom';
import React from 'react';

export default function Footer() {
  return (
    <div>
      <div className="flex justify-center text-sm text-gray-700 mb-4 mt-8 w-full">
        <Link to="/faq">FAQ's</Link>
        <div className="mx-1">|</div>
        <Link to="/impressum">Impressum</Link>
        <div className="mx-1">|</div>
        <Link to="/dsgvo">Datenschutz</Link>
      </div>
      <span className="text-gray-500 text-xs block w-full text-center">Natürlich ist unser Angebot an alle QuarantäneHeld*Innen da draußen gerichtet.</span>
    </div>
  );
}
