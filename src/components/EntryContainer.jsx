import React, { useState } from 'react';
import EntryMap from './EntryMap';
import { EntryList } from './EntryList';
import { useTranslation } from 'react-i18next';

export default function EntryContainer({ pageSize }) {
  const { t } = useTranslation();

  const [isMapView, setIsMapView] = useState(false);

  return (
    <div>
      <div className="flex flex-row justify-center">
        <button
          type="button"
          onClick={() => {
            setIsMapView(false);
          }}
          className={`text-white items-center rounded-l py-3 px-6 btn-main ${
            isMapView ? 'btn-light-green' : 'btn-dark-green'
          } hover:opacity-75`}
        >
          {t('components.filteredList.list')}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsMapView(true);
          }}
          className={`text-white items-center rounded-r py-3 px-6 btn-main ${
            isMapView ? 'btn-dark-green' : 'btn-light-green'
          } hover:opacity-75`}
        >
          {t('components.filteredList.map')}
        </button>
      </div>
      {isMapView ? (
        <EntryMap />
      ) : (
        <EntryList pageSize={pageSize}/>
      )}
    </div>
  );
}
