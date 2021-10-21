import { GeoCollectionReference, GeoQuery } from 'geofirestore';

import {
  MAX_RESULTS,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
} from '../../config';

import { AskForHelpCollectionEntry } from '../../types/interface/collections/AskForHelpCollectionEntry';
import { NotificationsCollectionEntry } from '../../types/interface/collections/NotificationsCollectionEntry';
import { CollectionName } from '../../types/enum/CollectionName';

interface Result {
  initialSize: number;
  eligibleHelpOffers: NotificationsCollectionEntry[];
}

export async function getEligibleHelpOffers(db: FirebaseFirestore.Firestore, askForHelpId: string, askForHelpSnapData: AskForHelpCollectionEntry): Promise<Result> {
  let queryResult: NotificationsCollectionEntry[] = [];
  const notificationsRef: GeoCollectionReference = new GeoCollectionReference(db.collection(CollectionName.Notifications));
  const { coordinates } = askForHelpSnapData;
  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    // eslint-disable-next-line no-console
    console.warn('Coordinates are not defined!', coordinates);
    throw new Error(`Coordinates for entry ${askForHelpId} are not set!`);
  }
  const query: GeoQuery = notificationsRef.near({ center: coordinates, radius: 30 });
  queryResult = (await query.get()).docs.map((doc) => doc.data() as NotificationsCollectionEntry);
  // eslint-disable-next-line no-console
  console.log(`Received ${queryResult.length} results for ${askForHelpId}`);
  if (queryResult.length >= EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK) {
    throw new Error(`Sanity check for ${askForHelpId} failed! Query result size: ${queryResult.length}`);
  }

  const { notificationReceiver: previouslyContacted } = askForHelpSnapData;
  if (previouslyContacted !== undefined) {
    queryResult = queryResult.filter(entry => !previouslyContacted.includes(entry.uid));
  }

  let eligibleHelpOffers: NotificationsCollectionEntry[] = [];
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
