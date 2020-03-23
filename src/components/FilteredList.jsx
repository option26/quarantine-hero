import React, { useState, useEffect } from 'react';
import { GeoFirestore } from 'geofirestore';
import { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import Entry from './Entry';
import Slider from './Slider';
import LocationInput from './LocationInput';
import { isMapsApiEnabled } from '../featureFlags';

export default function FilteredList(props) {
  const { t } = useTranslation();

  const {
    pageSize = 0,
  } = props;

  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(10); // In KM
  const [sliderVisible, setSliderVisible] = useState(false);
  const [entries, setEntries] = useState([]);

  const collection = fb.store.collection('ask-for-help');
  const geoCollection = new GeoFirestore(fb.store).collection('ask-for-help');

  const [lastEntry, setLastEntry] = useState(undefined);
  const [scheduledSearch, setScheduledSearch] = useState(undefined);

  const buildQuery = async (lastLoaded = undefined) => {
    let query = collection.orderBy('d.timestamp', 'desc');

    if (lastLoaded !== undefined) {
      query = query.startAfter(lastLoaded);
    }
    if (pageSize > 0) {
      query = query.limit(pageSize);
    }

    return query;
  };

  const buildFilteredQuery = async (searchAttr) => {
    // Fallback
    if (!searchAttr) return buildQuery();

    if (isMapsApiEnabled) {
      try {
        const results = await geocodeByAddress(searchAttr);
        const coordinates = await getLatLng(results[0]);
        return geoCollection.near({ center: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng), radius });
      } catch (error) {
        // Fallback
        // eslint-disable-next-line no-console
        console.error(error);
        return buildQuery();
      }
    } else {
      return collection.orderBy('d.plz', 'asc').startAt(searchAttr).endAt(`${searchAttr}\uf8ff`);
    }
  };

  const appendDocuments = (documents) => {
    setLastEntry(documents[documents.length - 1]);
    const newEntries = documents.map((doc) => {
      const data = doc.data();
      return { ...(data.d || data), id: doc.id };
    });
    setEntries((e) => ([...e, ...newEntries]));
  };

  const loadDocuments = async (queryPromise, searchActive) => {
    const query = await queryPromise;
    const results = await query.get();
    setEntries([]);

    let documents = results.docs;

    // we need to perform client-side sorting since the location filter is applied
    // https://github.com/kenodressel/quarantine-hero/issues/89
    if (searchActive) {
      if (isMapsApiEnabled) {
        documents = documents.sort((doc1, doc2) => doc2.data().timestamp - doc1.data().timestamp);
      } else {
        documents = documents.sort((doc1, doc2) => doc2.data().d.timestamp - doc1.data().d.timestamp);
      }
    }
    appendDocuments(documents);
  };

  const loadMoreDocuments = async () => {
    const query = await buildQuery(lastEntry);
    const results = await query.get();
    if (results.docs.length > 0) {
      appendDocuments(results.docs);
    }
  };

  useEffect(() => {
    loadDocuments(buildQuery());
  }, []);

  const handleChange = (address) => {
    setLocation(address);
    if (!address) {
      setSearching(false);
      loadDocuments(buildQuery());
    }

    // Prevent searching on input change if maps api enabled
    if (!isMapsApiEnabled) {
      // Stop any scheduled search task
      if (scheduledSearch) {
        clearTimeout(scheduledSearch);
      }

      // If address is non-empty, schedule new search task to only start searching after user stopped typing
      if (address) {
        setSearching(true);
        setScheduledSearch(setTimeout(() => {
          loadDocuments(buildFilteredQuery(address), true);
        }, 500));
      }
    }
  };

  const handleSelect = (address) => {
    setLocation(address);
    // Prevent action on select if maps api disabled
    if (isMapsApiEnabled) {
      // If address is non-empty search for it
      if (address) {
        setSearching(true);
        loadDocuments(buildFilteredQuery(address), true);
      } else {
        setSearching(false);
        loadDocuments(buildQuery());
      }
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
      <div className="flex -mx-1">
        <div className="px-1 w-full">
          <LocationInput required fullText onChange={handleChange} value={location} onSelect={handleSelect} />
        </div>
        <div className="px-1 flex">
          <button
            type="button"
            className="outline-none px-2 btn-light btn-main rounded items-center hover:opacity-75"
            onClick={() => setSliderVisible((current) => !current)}
          >
            {radius}
            km
          </button>
        </div>
      </div>
      {sliderVisible
        ? (
          <div className="pt-5 w-full">
            <Slider
              min={1}
              max={30}
              initialValue={radius}
              onChange={(v) => setRadius(v)}
              onAfterChange={() => {
                setSliderVisible(false);
                loadDocuments(buildFilteredQuery(location), searching);
              }}
            />
          </div>
        ) : null}
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
            <button type="button" onClick={loadMoreDocuments} className="items-center rounded py-3 px-6 btn-main btn-gray md:flex-1 hover:opacity-75">
              {t('components.filteredList.showMore')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
