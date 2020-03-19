import React, {useState, useEffect} from 'react';
import fb from '../firebase';
import {GeoFirestore} from 'geofirestore';
import {getLatLng, geocodeByAddress} from 'react-places-autocomplete';
import Entry from './Entry';
import LocationInput from './LocationInput';
import {isMapsApiEnabled} from '../featureFlags.js';
import {Link} from 'react-router-dom';
import Pagination from './Pagination';

export default function FilteredList(props) {

  const {
    pageSize = 0
  } = props;

  const [paginationOverwrite, overwritePagination] = useState(false);
  const [location, setLocation] = useState('');
  const [entries, setEntries] = useState([
    {
      id: 'placeholder-id',
    }]);

  const [firstEntry, setFirstEntry] = useState(undefined);
  const [lastEntry, setLastEntry] = useState(undefined);

  const collection = fb.store.collection('ask-for-help');

  // Create a Firestore reference
  const geofirestore = new GeoFirestore(fb.store);

  // Create a GeoCollection reference
  const geocollection = geofirestore.collection('ask-for-help');

  const buildQuery = async (location = undefined, startAfter = undefined, endBefore = undefined, limit = pageSize) => {
    var queryResult;

    //If map api is available, 
    if (isMapsApiEnabled && location && location !== '') {
      queryResult = geocollection;
      overwritePagination(true);

      try {
        var results = await geocodeByAddress(location);
        var coordinates = await getLatLng(results[0]);
        queryResult = queryResult.near({ center: new fb.app.firestore.GeoPoint(coordinates.lat, coordinates.lng), radius: 30 });
      } catch (error) {
        queryResult = collection.orderBy('d.timestamp', 'desc');
        console.error('Error', error);
      }
    } else {
      queryResult = collection;

      if (location && location !== '') {
        queryResult = queryResult.orderBy('d.plz', 'asc');
        overwritePagination(true);

        var lowerLimit = Number.parseInt(location) * (Math.pow(10, Math.max(5 - location.length, 0)));
        var upperLimit = (Number.parseInt(location) + 1) * (Math.pow(10, Math.max(5 - location.length, 0)));

        queryResult = queryResult.where("d.plz", ">=", lowerLimit.toString());
        queryResult = queryResult.where("d.plz", "<=", upperLimit.toString());
      } else {
        queryResult = queryResult.orderBy('d.timestamp', 'desc');
        overwritePagination(false);

        if (startAfter !== undefined) {
          queryResult = queryResult.startAfter(startAfter);
          if (limit > 0) queryResult = queryResult.limit(limit);
        } else if (endBefore !== undefined) {
          queryResult = queryResult.endBefore(endBefore);
          if (limit > 0) queryResult = queryResult.limitToLast(limit);
        } else {
          if (limit > 0) queryResult = queryResult.limit(limit);
        }
      }
    }

    return queryResult;
  };

  const getUserData = async (queryPromise) => {
    var query = await queryPromise;

    query.get().then(value => {
      //If we go to the prev. page, it could happen that new request were coming in. Hence,
      //we need to check whether we are showing too few request
      if (value.docs.length < pageSize && value.query?.bm["endAt"]) {
        getUserData(buildQuery());
        return;
      }

      setFirstEntry(value.docs[0]);
      setLastEntry(value.docs[value.docs.length - 1]);

      setEntries(value.docs.map(doc => {
        var data = doc.data();
        return { ...(data.d || data), id: doc.id }
      }));
    });
  };

  useEffect(() => {
    getUserData(buildQuery())
  }, []);

  const nextPage = () => {
    if (pageSize > 0 && !paginationOverwrite) {
      getUserData(buildQuery(location, lastEntry));
    }
  }

  const prevPage = () => {
    if (pageSize > 0 && !paginationOverwrite) {
      getUserData(buildQuery(location, undefined, firstEntry));
    }
  }

  const showCurrent = () => {
    if (pageSize > 0 && !paginationOverwrite) {
      getUserData(buildQuery(location));
    }
  }

  const handleChange = address => {
    setLocation(address);
    if (!isMapsApiEnabled || !address || address === '') {
      getUserData(buildQuery(address));
    }
  };

  const handleSelect = address => {
    setLocation(address);
    if (isMapsApiEnabled) {
      getUserData(buildQuery(address));
    }
  };

  const NoHelpNeeded = (props) => {
    return <div className="w-full text-center my-10">In {location} wird gerade aktuell keine Hilfe gebraucht!</div>
  };

  return (<div>
      <div className="pt-3">
        <LocationInput onChange={handleChange} value={location} onSelect={handleSelect}/>
      </div>
      <div className="py-3 w-full">
        <div className="my-3 w-full">
          <Link to='/notify-me' className="btn-green-secondary my-3 mb-6 w-full block" onClick={() => fb.analytics.logEvent('button_subscribe_region')}>
            Benachrichtige mich wenn jemand in {location && location !== '' ? `der Nähe von ${location}` : 'meiner Nähe'} Hilfe braucht!</Link>
        </div>
        {entries.length === 0 ? <NoHelpNeeded /> : entries.map(
          entry => (
            <Entry key={entry.id} {...entry}/>))
        }
        {(pageSize > 0 && !paginationOverwrite) ? <div className="flex justify-center pt-3">
          <Pagination onPrevPage={prevPage} onNextPage={nextPage} onShowCurrent={showCurrent} />
        </div> : null
        }
      </div>
    </div>
  );
}
