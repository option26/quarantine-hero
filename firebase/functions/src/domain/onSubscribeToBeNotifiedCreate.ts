import * as admin from 'firebase-admin';

import { CollectionName } from '@enum/CollectionName';

export async function onSubscribeToBeNotifiedCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    await db.collection(CollectionName.Stats).doc('external').update({
      regionSubscribed: admin.firestore.FieldValue.increment(1),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
