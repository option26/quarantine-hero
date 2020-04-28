import React from 'react';
import './Loader.css';

const Spinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default function Loader({ children, waitOn = false }) {
  if (waitOn) {
    return children;
  }
  return <Spinner />;
}
