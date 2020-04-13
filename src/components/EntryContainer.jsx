import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EntryMap from './EntryMap';
import EntryList from './EntryList';

export default function EntryContainer({ pageSize, title }) {
  const { t } = useTranslation();

  const [isMapView, setIsMapView] = useState(false);

  return (
    <div>
      <div className={`flex flex-row ${title ? 'justify-between' : 'justify-center'}`}>
        {title && <div className="xs:text-xl sm:text-2xl flex-shrink font-bold font-open-sans">{title}</div>}
        <div className="flex-none flex-row justify-center">
          <button
            type="button"
            onClick={() => {
              setIsMapView(false);
            }}
            className={`text-white items-center rounded-l px-1 py-3 xs:px-6 btn-main ${
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
            className={`text-white items-center rounded-r px-1 py-3 xs:px-6 btn-main ${
              isMapView ? 'btn-dark-green' : 'btn-light-green'
            } hover:opacity-75`}
          >
            {t('components.filteredList.map')}
          </button>
        </div>
      </div>
      {isMapView ? (
        <EntryMap />
      ) : (
        <EntryList pageSize={pageSize} />
      )}
    </div>
  );
}
