import * as admin from 'firebase-admin';

import {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
} from '@utilities/utils';

import { DeletedCollectionEntry } from '@interface/collections/DeletedCollectionEntry';
import { CollectionName } from '@enum/CollectionName';

export async function onDeletedCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as DeletedCollectionEntry;
    // collectionName can be either "ask-for-help" or "solved-posts"
    const { collectionName } = snapValue
    const { uid } = snapValue.d;

    if (!userIdsMatch(db, collectionName, snap.id, uid)) return;

    await migrateResponses(db, collectionName, snap.id, CollectionName.Deleted);
    await deleteDocumentWithSubCollections(db, collectionName, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
