import React from 'react';
import './Loader.css';

const Loader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loader;
