import * as admin from 'firebase-admin';

import { postToSlack } from '../utilities/slack';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';

export async function onAskForHelpCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const askForHelpId = snap.id; // get the id
    const parentPath = snap.ref.parent.path; // get the id
    const askForHelpSnap = await db.collection(parentPath).doc(askForHelpId).get();
    const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;

    // Enforce field to 0
    await snap.ref.update({
      'd.notificationCounter': 0,
    });

    await db.collection(CollectionName.Stats).doc('external').update({
      askForHelp: admin.firestore.FieldValue.increment(1),
    });

    await postToSlack(askForHelpId, askForHelpSnapData);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
