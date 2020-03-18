import React from 'react';

export default function Pagination(props) {


  return (
    <div class="inline-flex">
      <button onClick={e=> props.onPrevPage(e.target.value)} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        Zurück
      </button>
      <button onClick={e=> props.onShowCurrent(e.target.value)} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4">
        Aktuellste
      </button>
      <button onClick={e=> props.onNextPage(e.target.value)} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
        Weiter
      </button>
    </div>
  );
}
