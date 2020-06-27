import * as admin from 'firebase-admin';

import {
  deleteDocumentWithSubCollections,
  getEntriesOfUser,
} from '@utilities/utils';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { CollectionName } from '@enum/CollectionName';

export async function onUserDelete(user: UserRecord): Promise<void> {
  try {
    const db = admin.firestore();
    const promises = [];

    // Delete ask for helps
    const askForHelpEntries = await getEntriesOfUser(db, CollectionName.AskForHelp, 'd.uid', user.uid);
    promises.push(askForHelpEntries.docs.map((doc) => deleteDocumentWithSubCollections(db, CollectionName.AskForHelp, doc.id)));

    // Delete solved posts
    const solvedPostEntries = await getEntriesOfUser(db, CollectionName.SolvedPosts, 'd.uid', user.uid);
    promises.push(solvedPostEntries.docs.map((doc) => deleteDocumentWithSubCollections(db, CollectionName.SolvedPosts, doc.id)));

    // Delete deleted posts
    const deletedPostEntries = await getEntriesOfUser(db, CollectionName.Deleted, 'd.uid', user.uid);
    promises.push(deletedPostEntries.docs.map((doc) => deleteDocumentWithSubCollections(db, CollectionName.Deleted, doc.id)));

    // Delete help offers for all (ask-for-help, solved and deleted)
    const helpOfferEntries = await getEntriesOfUser(db, CollectionName.OfferHelp, 'email', (user.email || 'undefined'), true);
    promises.push(helpOfferEntries.docs.map((doc) => doc.ref.update({ email: '', answer: '' })));

    // Delete notifications
    const notificationEntries = await getEntriesOfUser(db, CollectionName.Notifications, 'd.uid', user.uid);
    promises.push(notificationEntries.docs.map((doc) => doc.ref.delete()));

    // Anonymize reported by
    const reportedPostsEntries = await getEntriesOfUser(db, CollectionName.ReportedPosts, 'uid', user.uid);
    promises.push(reportedPostsEntries.docs.map((doc) => doc.ref.update({ uid: 'ghost-user' })));

    // Anonymize reported-by
    const reportedEntryIds = reportedPostsEntries.docs.map((doc) => doc.data().askForHelpId);
    const entryRefs = reportedEntryIds.map((id) => [
      db.collection(CollectionName.AskForHelp).doc(id),
      db.collection(CollectionName.SolvedPosts).doc(id),
      db.collection(CollectionName.Deleted).doc(id),
    ]).reduce((arr, elem) => arr.concat(elem), []);

    const reportedEntries = await db.getAll(...entryRefs);
    reportedEntries.forEach((doc) => {
      if (!doc.exists) return;

      promises.push(doc.ref.update({ 'd.reportedBy': admin.firestore.FieldValue.arrayRemove(user.uid) }));
      const data = doc && doc.data();
      if (data && !data.d.reportedBy.includes('ghost-user')) {
        promises.push(doc.ref.update({ 'd.reportedBy': admin.firestore.FieldValue.arrayUnion('ghost-user') }));
      }
    });

    await Promise.all(promises);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}
