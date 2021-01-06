import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import NotifyMe from './NotifyMe';
import Entry from './entry/Entry';
import Slider from './Slider';
import LocationInput from './LocationInput';
import { getGeodataForPlace, getGeodataForString } from '../services/GeoService';
import useQuery from '../util/useQuery';
import { getInitialDocuments, searchDocuments, loadMoreDocuments } from '../services/loadData';

export default function EntryList({ pageSize }) {
  const { t } = useTranslation();
  const history = useHistory();
  const windowLocation = useLocation();

  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState();
  const [radius, setRadius] = useState(10); // In KM
  const [sliderVisible, setSliderVisible] = useState(false);
  const [entries, setEntries] = useState([]);

  const [lastEntry, setLastEntry] = useState(undefined);

  const { address: addressFromUrl } = useQuery();

  const appendDocuments = (documents, clear = false) => {
    if (documents.length === 0) {
      if (clear) {
        setEntries([]);
      }
      return;
    }

    // We need to filter out the solved posts here as we want to load the next documents based on the timestamp of the last ask-for-help document
    const oldestEntry = documents
      .filter((d) => !d.solved)
      .reduce((oldest, doc) => (doc.timestamp < oldest.timestamp ? doc : oldest), documents[0]);

    setLastEntry(oldestEntry);

    if (clear) {
      setEntries(documents);
    } else {
      setEntries((e) => [...e, ...documents]);
    }
  };

  const loadMore = async () => {
    if (lastEntry === undefined) {
      return;
    }
    const documents = await loadMoreDocuments(lastEntry.timestamp, pageSize);
    appendDocuments(documents);
  };

  useEffect(() => {
    async function init() {
      if (addressFromUrl) {
        const geoData = await getGeodataForString(addressFromUrl);
        if (geoData === undefined) {
          return;
        }
        setLocation(geoData.name);
        setPlaceId(geoData.id);
        const documents = await searchDocuments(geoData, radius);
        appendDocuments(documents, true);
      } else {
        setLocation('');
        const documents = await getInitialDocuments(pageSize);
        appendDocuments(documents, true);
      }
    }

    init();
  }, [addressFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetSearch = async () => {
    setSearching(false);
    const documents = await getInitialDocuments(pageSize);
    appendDocuments(documents, true);
  };

  const handleChange = async (address) => {
    setLocation(address);

    if (!address) {
      resetSearch();
    }
  };

  const handleSelect = async (address, selectedPlaceId) => {
    setLocation(address);
    setPlaceId(selectedPlaceId);

    setSearching(true);
    const geoData = await (selectedPlaceId !== undefined ? getGeodataForPlace(selectedPlaceId) : getGeodataForString(address));
    const documents = await searchDocuments(geoData, radius);
    setEntries(documents);
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

  const handleRadiusChange = async () => {
    if (!searching) {
      return;
    }

    const geoData = await (placeId !== undefined ? getGeodataForPlace(placeId) : getGeodataForString(location));
    const documents = await searchDocuments(geoData, radius);
    setEntries(documents);
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
      {sliderVisible ? (
        <div className="pt-5 w-full">
          <Slider
            min={1}
            max={30}
            initialValue={radius}
            onChange={(v) => setRadius(v)}
            onAfterChange={() => {
              setSliderVisible(false);
              handleRadiusChange();
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
            onClick={loadMore}
            className="items-center rounded py-3 px-6 btn-main btn-gray md:flex-1 hover:opacity-75"
          >
            {t('components.filteredList.showMore')}
          </button>
        </div>
      ) : null}
    </>
  );
}
