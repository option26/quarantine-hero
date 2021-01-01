import React, { useState, useEffect } from 'react';
import { GeoFirestore } from 'geofirestore';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
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
import parseDoc from '../util/parseDoc';
import useQuery from '../util/useQuery';

export default function EntryList({ pageSize = 0 }) {
  const { t } = useTranslation();
  const history = useHistory();
  const windowLocation = useLocation();

  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(10); // In KM
  const [sliderVisible, setSliderVisible] = useState(false);
  const [entries, setEntries] = useState([]);

  const askForHelpCollection = fb.store.collection('ask-for-help');
  const solvedPostsCollection = fb.store.collection('solved-posts');
  const geoCollectionAskForHelp = new GeoFirestore(fb.store).collection('ask-for-help');

  const [lastEntry, setLastEntry] = useState(undefined);
  const [scheduledSearch, setScheduledSearch] = useState(undefined);

  const { address: addressFromUrl } = useQuery();

  const buildQuery = async (collection, lastLoaded = undefined) => {
    let query = collection.orderBy('d.timestamp', 'desc');

    if (lastLoaded !== undefined) {
      query = query.startAfter(lastLoaded);
    }
    if (pageSize > 0) {
      query = query.limit(pageSize);
    }

    return query;
  };

  const buildFilteredQuery = async (collection, geoCollection, searchAttr, placeId = undefined) => {
    // Fallback
    if (!searchAttr) return buildQuery(collection);

    if (isMapsApiEnabled) {
      try {
        let result;
        if (placeId) {
          result = await getGeodataForPlace(placeId);
        } else {
          result = await getGeodataForString(searchAttr);
        }
        const coordinates = getLatLng(result);
        return geoCollection.near({
          center: new fb.app.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng,
          ),
          radius,
        });
      } catch (error) {
        // Fallback, return mock query
        Sentry.captureException(error);
        return { get: () => ({ docs: [] }) };
      }
    } else {
      return collection
        .orderBy('d.plz', 'asc')
        .startAt(searchAttr)
        .endAt(`${searchAttr}\uf8ff`);
    }
  };

  // we cannot use destructuring syntax here because it will break the firebase document entries
  const getAnnotatedSolvedPosts = (solvedPostsResults) => solvedPostsResults.docs.map((entry) => {
    entry.solved = true; // eslint-disable-line no-param-reassign
    return entry;
  });

  const appendDocuments = (documents) => {
    setLastEntry(documents[documents.length - 1]);
    const newEntries = documents
      .map(parseDoc)
      .filter(Boolean); // filter entries that we weren't able to parse and are therefore null
    setEntries((e) => [...e, ...newEntries]);
  };

  const sortDocumentsByTimestamp = (documents) => documents.sort((doc1, doc2) => doc2.data().timestamp - doc1.data().timestamp);
  const sortDocumentsByTimestampOnDataProperty = (documents) => documents.sort((doc1, doc2) => doc2.data().d.timestamp - doc1.data().d.timestamp);

  const getSortedDocuments = (documents, searchActive) => {
    // we need to perform client-side sorting since the location filter is applied
    // https://github.com/quarantine-hero/quarantine-hero/issues/89
    if (searchActive) {
      if (isMapsApiEnabled) {
        // if maps api is enabled, we retrieve documents from the geo collections, resulting in different structure
        const sortedDocuments = sortDocumentsByTimestamp(documents);
        return sortedDocuments;
      }
      const sortedDocuments = sortDocumentsByTimestampOnDataProperty(documents);
      return sortedDocuments;
    }

    const sortedDocuments = sortDocumentsByTimestampOnDataProperty(documents);
    return sortedDocuments;
  };

  const loadOpenDocuments = async (queryPromise, searchActive) => {
    const query = await queryPromise;
    const results = await query.get();
    setEntries([]);

    const documents = results.docs;
    const sortedDocuments = getSortedDocuments(documents, searchActive);
    appendDocuments(sortedDocuments);
  };

  const loadOpenAndSolvedDocuments = async (askForHelpQueryPromise, solvedPostsQueryPromise, searchActive) => {
    const askForHelpQuery = await askForHelpQueryPromise;
    const solvedPostsQuery = await solvedPostsQueryPromise;
    const askForHelpResults = await askForHelpQuery.get();
    const solvedPostsResults = await solvedPostsQuery.get();
    setEntries([]);

    const solvedPostsResultsAnnotated = getAnnotatedSolvedPosts(solvedPostsResults);

    const documents = [...askForHelpResults.docs, ...solvedPostsResultsAnnotated];
    const sortedDocuments = getSortedDocuments(documents, searchActive);
    appendDocuments(sortedDocuments);
  };

  const loadMoreDocuments = async () => {
    const askForHelpQuery = await buildQuery(askForHelpCollection, lastEntry);
    const askForHelpResults = await askForHelpQuery.get();
    const { length: askForHelpResultsLength } = askForHelpResults.docs;

    if (!askForHelpResultsLength) {
      return;
    }

    const documents = [...askForHelpResults.docs];
    const sortedDocs = documents.sort(
      (doc1, doc2) => doc2.data().d.timestamp - doc1.data().d.timestamp,
    );
    appendDocuments(sortedDocs);
  };

  useEffect(() => {
    if (addressFromUrl) {
      setLocation(addressFromUrl);
      loadOpenDocuments(
        buildFilteredQuery(askForHelpCollection, geoCollectionAskForHelp, addressFromUrl),
        true,
      );
    } else {
      setLocation('');
      loadOpenAndSolvedDocuments(buildQuery(askForHelpCollection), buildQuery(solvedPostsCollection));
    }
  }, [addressFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (address) => {
    setLocation(address);
    if (!address) {
      setSearching(false);
      loadOpenAndSolvedDocuments(
        buildQuery(askForHelpCollection),
        buildQuery(solvedPostsCollection),
      );
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
            loadOpenDocuments(
              buildFilteredQuery(askForHelpCollection, geoCollectionAskForHelp, address),
              true,
            );
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
        loadOpenDocuments(
          buildFilteredQuery(askForHelpCollection, geoCollectionAskForHelp, address, placeId),
          true,
        );
      } else {
        setSearching(false);
        loadOpenAndSolvedDocuments(
          buildQuery(askForHelpCollection),
          buildQuery(solvedPostsCollection),
        );
      }
    }
  };

  const handleAddressClick = (address) => {
    if (address) {
      const newLocation = {
        ...windowLocation,
        search: `?address=${address}`,
      };
      history.push(newLocation);
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
              loadOpenDocuments(
                buildFilteredQuery(askForHelpCollection, geoCollectionAskForHelp, location),
                searching,
              );
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
            onAddressClick={handleAddressClick}
            showAsSolved={entry.solved}
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
