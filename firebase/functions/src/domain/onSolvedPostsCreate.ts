import * as admin from 'firebase-admin';

import {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
} from '@utilities/utils';

import { SolvedPostsCollectionEntry } from '@interface/collections/SolvedPostsCollectionEntry';
import { CollectionName } from '@enum/CollectionName';

export async function onSolvedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as SolvedPostsCollectionEntry;
    const { uid } = snapValue.d;

    if (!userIdsMatch(db, CollectionName.AskForHelp, snap.id, uid)) return;

    await migrateResponses(db, CollectionName.AskForHelp, snap.id, CollectionName.SolvedPosts);
    await deleteDocumentWithSubCollections(db, CollectionName.AskForHelp, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
