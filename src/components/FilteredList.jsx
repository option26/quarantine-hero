import React, { useState, useEffect } from 'react';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import Entry from './Entry';
import LocationInput from './LocationInput';
import { isMapsApiEnabled } from '../featureFlags';

export default function FilteredList(props) {
  const { t } = useTranslation();

  const {
    pageSize = 0,
  } = props;

  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([]);
  const [scheduledSearch, setScheduledSearch] = useState([]);

  const [lastEntry, setLastEntry] = useState(undefined);

  const collection = fb.store.collection('ask-for-help');

  // Create a Firestore reference
  const geofirestore = new GeoFirestore(fb.store);

  // Create a GeoCollection reference
  const geocollection = geofirestore.collection('ask-for-help');

  const buildQuery = async (loc = undefined, lastLoaded = undefined, limit = pageSize) => {
    let queryResult;

    if (searching) {
      setEntries([]);
      if (!loc) {
        setSearching(false);
      }
    } else if (!searching && loc) {
      setEntries([]);
      setSearching(true);
    }

    // If map api is available,
    if (isMapsApiEnabled && loc && loc !== '') {
      queryResult = geocollection;

      try {
        const results = await geocodeByAddress(loc);
        const coordinates = await getLatLng(results[0]);
        queryResult = queryResult.near({ center: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng), radius: 30 });
      } catch (error) {
        queryResult = collection.orderBy('d.timestamp', 'desc');
      }
    } else {
      queryResult = collection;

      if (loc && loc !== '') {
        queryResult = queryResult.orderBy('d.plz', 'asc');
        queryResult = queryResult.startAt(loc).endAt(`${loc}\uf8ff`);
      } else {
        queryResult = queryResult.orderBy('d.timestamp', 'desc');

        if (lastLoaded !== undefined) {
          queryResult = queryResult.startAfter(lastLoaded);
          if (limit > 0) queryResult = queryResult.limit(limit);
        } else if (limit > 0) queryResult = queryResult.limit(limit);
      }
    }

    return queryResult;
  };


  const appendDocuments = (documents) => {
    setLastEntry(documents[documents.length - 1]);
    const newEntries = documents.map((doc) => {
      const data = doc.data();
      return { ...(data.d || data), id: doc.id };
    });
    setEntries((e) => ([...e, ...newEntries]));
  };

  const initialize = async () => {
    const query = await buildQuery();
    query.get().then((value) => {
      appendDocuments(value.docs);
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  const loadMore = async () => {
    const query = await buildQuery(undefined, lastEntry);
    query.get().then((value) => {
      appendDocuments(value.docs);
    });
  };

  const loadFilteredData = async (queryPromise) => {
    const query = await queryPromise;
    const value = await query.get();

    // no location filter applied
    if (!location) {
      appendDocuments(value.docs);
      return;
    }

    // we need to perform client-side sorting since the location filter is applied
    // https://github.com/kenodressel/quarantine-hero/issues/89
    const docsSortedInDescendingOrder = value.docs.sort((doc1, doc2) => doc2.data().d.timestamp - doc1.data().d.timestamp);
    appendDocuments(docsSortedInDescendingOrder);
  };

  const handleChange = (address) => {
    setLocation(address);
    if (!isMapsApiEnabled) {
      if (scheduledSearch) {
        clearTimeout(scheduledSearch);
      }
      setScheduledSearch(setTimeout(() => {
        loadFilteredData(buildQuery(address));
      }, 500));
    }
  };

  const handleSelect = (address) => {
    setLocation(address);
    if (isMapsApiEnabled) {
      if (scheduledSearch) {
        clearTimeout(scheduledSearch);
      }
      setScheduledSearch(setTimeout(() => {
        loadFilteredData(buildQuery(address));
      }, 500));
    }
  };

  const NoHelpNeeded = () => (
    <div className="w-full text-center my-10 font-open-sans">
      {t('components.filteredList.in')}
      {' '}
      {location}
      {' '}
      {t('components.filteredList.noHelpCurrentlyNeeded')}
    </div>
  );

  return (
    <div>
      <div className="pt-3">
        <LocationInput required onChange={handleChange} value={location} onSelect={handleSelect} />
      </div>
      <div className="py-3 w-full">
        <div className="my-3 w-full">
          <Link to="/notify-me" className="btn-green-secondary my-3 mb-6 w-full block" onClick={() => fb.analytics.logEvent('button_subscribe_region')}>
            {t('components.filteredList.notifyMe')}
            {' '}
            {location && location !== '' ? `${t('components.filteredList.closeTo')} ${location}` : t('components.filteredList.closeToMe')}
            {' '}
            {t('components.filteredList.needsHelp')}
          </Link>
        </div>
        {entries.length === 0 ? <NoHelpNeeded /> : entries.map(
          (entry) => (
            <Entry key={entry.id} {...entry} />),
        )}
        {(pageSize > 0 && !searching) ? (
          <div className="flex justify-center pt-3">
            <button type="button" onClick={loadMore} className="items-center rounded py-3 px-6 btn-main btn-gray md:flex-1 hover:opacity-75">
              {t('components.filteredList.showMore')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
