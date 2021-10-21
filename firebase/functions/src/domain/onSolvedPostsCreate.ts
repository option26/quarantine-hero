import * as admin from 'firebase-admin';

import {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
} from '../utilities/utils';
import { postReplyToSlack } from '../utilities/slack';

import { SolvedPostsCollectionEntry } from '../types/interface/collections/SolvedPostsCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';

export async function onSolvedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as SolvedPostsCollectionEntry;
    const { uid } = snapValue;

    if (!userIdsMatch(db, CollectionName.AskForHelp, snap.id, uid)) return;

    await migrateResponses(db, CollectionName.AskForHelp, snap.id, CollectionName.SolvedPosts);
    await deleteDocumentWithSubCollections(db, CollectionName.AskForHelp, snap.id);

    try {
      // Don't let message sending break everything
      const message = 'Der Eintrag wurde als gelöst markiert ✅';
      await postReplyToSlack(snapValue.slackMessageRef, message, false);

    } catch (err) {
      console.log('Error posting to slack', err);
    }

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
