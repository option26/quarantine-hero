import { GeoCollectionReference, GeoQuery } from 'geofirestore';

import {
  MAX_RESULTS,
  MAPS_ENABLED,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
} from '../../config';

import { AskForHelpCollectionEntry } from '../../types/interface/collections/AskForHelpCollectionEntry';
import { NotificationsCollectionEntry } from '../../types/interface/collections/NotificationsCollectionEntry';
import { CollectionName } from '../../types/enum/CollectionName';

interface Result {
  initialSize: number;
  eligibleHelpOffers: NotificationsCollectionEntry['d'][];
}

export async function getEligibleHelpOffers(db: FirebaseFirestore.Firestore, askForHelpId: string, askForHelpSnapData: AskForHelpCollectionEntry): Promise<Result> {
  const dist = (search: string, doc: NotificationsCollectionEntry['d']) => Math.abs(Number(search) - Number(doc.plz));
  let queryResult: NotificationsCollectionEntry['d'][] = [];
  if (MAPS_ENABLED) {
    const notificationsRef: GeoCollectionReference = new GeoCollectionReference(db.collection(CollectionName.Notifications));
    const { coordinates } = askForHelpSnapData.d;
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
      // eslint-disable-next-line no-console
      console.warn('Coordinates are not defined!', coordinates);
      throw new Error(`Coordinates for entry ${askForHelpId} are not set!`);
    }
    const query: GeoQuery = notificationsRef.near({ center: coordinates, radius: 30 });
    queryResult = (await query.get()).docs.map((doc) => doc.data());
    // eslint-disable-next-line no-console
    console.log(`Received ${queryResult.length} results for ${askForHelpId}`);
    if (queryResult.length >= EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK) {
      throw new Error(`Sanity check for ${askForHelpId} failed! Query result size: ${queryResult.length}`);
    }
  } else {
    const notificationsRef = db.collection(CollectionName.Notifications);
    if (!askForHelpSnapData || !askForHelpSnapData.d || !askForHelpSnapData.d.plz) {
      // eslint-disable-next-line no-console
      console.warn('Failed to find plz for ask-for-help ', askForHelpSnapData);
    } else {
      const search = askForHelpSnapData.d.plz;
      const start = `${search.slice(0, -3)}000`;
      const end = `${search.slice(0, -3)}999`;
      const results = await notificationsRef.orderBy('d.plz').startAt(start).endAt(end).get();
      const allPossibleOffers: NotificationsCollectionEntry['d'][] = results.docs
        .map((doc) => ({ id: doc.id, ...doc.data().d as NotificationsCollectionEntry['d'] }))
        .filter(({ plz }) => plz.length === search.length);
      const sortedOffers: NotificationsCollectionEntry['d'][] = allPossibleOffers
        .map((doc) => ({ ...doc, distance: dist(search, doc) }))
        .sort((doc1, doc2) => doc1.distance - doc2.distance);
      if (sortedOffers.length > MAX_RESULTS) {
        const lastEntry = sortedOffers[MAX_RESULTS];
        queryResult = sortedOffers.filter((doc) => doc.distance && lastEntry.distance && doc.distance <= lastEntry.distance);
      } else {
        queryResult = sortedOffers;
      }
    }
  }

  const { notificationReceiver: previouslyContacted } = askForHelpSnapData.d;
  if (previouslyContacted !== undefined) {
    queryResult = queryResult.filter(entry => !previouslyContacted.includes(entry.uid));
  }

  let eligibleHelpOffers: NotificationsCollectionEntry['d'][] = [];
  if (queryResult.length > MAX_RESULTS) {
    for (let i = queryResult.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * i);
      const temp = queryResult[i];
      queryResult[i] = queryResult[j];
      queryResult[j] = temp;
    }
    eligibleHelpOffers = queryResult.slice(0, MAX_RESULTS);
  } else {
    eligibleHelpOffers = queryResult;
  }

  return { eligibleHelpOffers, initialSize: queryResult.length };
}
