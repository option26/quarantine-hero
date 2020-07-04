import * as admin from 'firebase-admin';

import { ReportedPostsCollectionEntry } from '../types/interface/collections/ReportedPostsCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';

export async function onReportedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as ReportedPostsCollectionEntry;
    const { askForHelpId, uid } = snapValue;

    // https://cloud.google.com/firestore/docs/manage-data/add-data#update_elements_in_an_array
    await db.collection(CollectionName.AskForHelp).doc(askForHelpId).update({
      'd.reportedBy': admin.firestore.FieldValue.arrayUnion(uid),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
