import React, { useState, useEffect } from 'react';
import { GeoFirestore } from 'geofirestore';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/browser';
import fb from '../firebase';
import NotifyMe from './NotifyMe';
import Entry from './entry/Entry';
import Slider from './Slider';
import LocationInput from './LocationInput';
import { isMapsApiEnabled } from '../featureFlags';
import {
  getGeodataForPlace,
  getGeodataForString,
  getLatLng,
} from '../services/GeoService';

export default function EntryList({ pageSize = 0 }) {
  const { t } = useTranslation();

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

  const buildFilteredQuery = async (searchAttr, placeId = undefined) => {
    // Fallback
    if (!searchAttr) return buildQuery();

    if (isMapsApiEnabled) {
      try {
        let results;
        if (placeId) {
          results = await getGeodataForPlace(placeId);
        } else {
          results = await getGeodataForString(searchAttr);
        }
        const coordinates = getLatLng(results[0]);
        return geoCollection.near({
          center: new fb.app.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng,
          ),
          radius,
        });
      } catch (error) {
        // Fallback
        Sentry.captureException(error);
        return buildQuery();
      }
    } else {
      return collection
        .orderBy('d.plz', 'asc')
        .startAt(searchAttr)
        .endAt(`${searchAttr}\uf8ff`);
    }
  };

  const appendDocuments = (documents) => {
    setLastEntry(documents[documents.length - 1]);
    const newEntries = documents.map((doc) => {
      const data = doc.data();
      return { ...(data.d || data), id: doc.id };
    });
    setEntries((e) => [...e, ...newEntries]);
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
        documents = documents.sort(
          (doc1, doc2) => doc2.data().timestamp - doc1.data().timestamp,
        );
      } else {
        documents = documents.sort(
          (doc1, doc2) => doc2.data().d.timestamp - doc1.data().d.timestamp,
        );
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        setScheduledSearch(
          setTimeout(() => {
            loadDocuments(buildFilteredQuery(address), true);
          }, 500),
        );
      }
    }
  };

  const handleSelect = (address, placeId) => {
    setLocation(address);
    // Prevent action on select if maps api disabled
    if (isMapsApiEnabled) {
      // If address is non-empty search for it
      if (address) {
        setSearching(true);
        loadDocuments(buildFilteredQuery(address, placeId), true);
      } else {
        setSearching(false);
        loadDocuments(buildQuery());
      }
    }
  };

  return (
    <>
      <div className="flex -mx-1 pt-5">
        <div className="px-1 w-full">
          <LocationInput
            fullText
            onChange={handleChange}
            value={location}
            onSelect={handleSelect}
          />
        </div>
        {isMapsApiEnabled ? (
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
        ) : null}
      </div>
      {sliderVisible ? (
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
      <NotifyMe location={location} />
      {entries.length === 0 ? (
        <div className="w-full text-center my-10 font-open-sans">
          {t('components.filteredList.noHelpCurrentlyNeededIn', {
            location,
          })}
        </div>
      ) : (
        entries.map((entry) => (
          <Entry
            key={entry.id}
            location={entry.location}
            id={entry.id}
            request={entry.request}
            timestamp={entry.timestamp}
            responses={entry.responses}
            reportedBy={entry.reportedBy}
            uid={entry.uid}
          />
        ))
      )}
      {pageSize > 0 && !searching ? (
        <div className="flex justify-center pt-3">
          <button
            type="button"
            onClick={loadMoreDocuments}
            className="items-center rounded py-3 px-6 btn-main btn-gray md:flex-1 hover:opacity-75"
          >
            {t('components.filteredList.showMore')}
          </button>
        </div>
      ) : null}
    </>
  );
}
