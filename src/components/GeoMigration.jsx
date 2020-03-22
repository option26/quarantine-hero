/* eslint-disable */
import { GeoFirestore } from 'geofirestore';
import React from 'react';
import fb from '../firebase';

export default function GeoMigration() {
  const Geocoder = new google.maps.Geocoder();

  const geofirestore = new GeoFirestore(fb.store);
  const helpColl = geofirestore.collection('ask-for-help');
  const notifyColl = geofirestore.collection('offer-help');

  function sleep(millis) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), millis);
    });
  }

  async function doMapsRequest(query) {
    let success = false;
    while (!success) {
      try {
        const result = await new Promise((resolve, reject) => {
          Geocoder.geocode(query, (results, status) => {
            if (status === 'OVER_QUERY_LIMIT') return reject(new Error('LIMIT'));
            if (status !== 'OK') return resolve([]);
            return resolve(results);
          });
        });

        success = true;
        return result
      } catch (err) {
        console.log(err);
      }
      await sleep(1000);
    }
  }

  async function handleBatches(batches) {
    const userWithDuplicates = [];

    console.log("Batches", batches);

    for (const batch of batches) {
      if (batch.plz === undefined) return;

      const geoQueries = [];
      if (batch.plz.length === 5) {
        geoQueries.push({
          componentRestrictions: {
            country: 'de',
            postalCode: batch.plz,
          },
        });
      } else {
        geoQueries.push({
          componentRestrictions: {
            country: 'at',
            postalCode: batch.plz,
          },
        });
        geoQueries.push({
          componentRestrictions: {
            country: 'ch',
            postalCode: batch.plz,
          },
        });
      }

      const rawGeoResults = await Promise.all(geoQueries.map((q) => doMapsRequest(q)));
      const geoResults = rawGeoResults.reduce((agg, elem) => agg.concat(elem), []);
      console.log(batch.plz, geoResults);

      let i = 0;
      for (const geoResult of geoResults) {
        for (const doc of batch.batch) {
          if (i > 0) {
            if(doc.coll === 'offer-help') {
              geofirestore.collection('offer-help').add({
                ...doc.data,
                location: geoResult.formatted_address,
                coordinates: new fb.app.firestore.GeoPoint(geoResult.geometry.location.lat(), geoResult.geometry.location.lng()),
              });
              userWithDuplicates.push(doc.data.uid);
            }
          } else {
            geofirestore.collection(doc.coll).doc(doc.id).update({
              location: geoResult.formatted_address,
              coordinates: new fb.app.firestore.GeoPoint(geoResult.geometry.location.lat(), geoResult.geometry.location.lng()),
            });
          }
        }
        i += 1;
      }

      await sleep(1000);
    }
    console.log(userWithDuplicates);
  }

  async function doGeoMigration() {
    const helpQuery = helpColl.near({ center: new fb.app.firestore.GeoPoint(0, 0), radius: 1 }).get();
    const notifyQuery = notifyColl.near({ center: new fb.app.firestore.GeoPoint(0, 0), radius: 1 }).get();

    const helpDocs = (await helpQuery).docs.map((d) => ({ coll: 'ask-for-help', id: d.id, data: d.data() }));
    const notifyDocs = (await notifyQuery).docs.map((d) => ({ coll: 'offer-help', id: d.id, data: d.data() }));
    console.log(helpDocs);
    
    const combinedSorted = helpDocs.concat(notifyDocs).sort((a, b) => {
      if (a.data.plz < b.data.plz) return -1;
      if (a.data.plz > b.data.plz) return 1;
      return 0;
    });

    const batches = [];

    const lastBatch = combinedSorted.reduce((coll, doc) => {
      if (doc.data.plz === coll.currPlz) {
        coll.currBatch.push(doc);
        return coll;
      }

      batches.push({ plz: coll.currPlz, batch: coll.currBatch });

      return ({ currPlz: doc.data.plz, currBatch: [doc] });
    }, { currPlz: combinedSorted[0].data.plz, currBatch: [] });
    batches.push({ plz: lastBatch.currPlz, batch: lastBatch.currBatch });

    handleBatches(batches);
  }

  return (
    <div>
      <button type="button" className="btn-green my-2" onClick={doGeoMigration}>Do Migration</button>
    </div>
  );
}
