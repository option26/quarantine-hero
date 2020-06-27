import * as admin from 'firebase-admin';
import { CollectionName } from './types/enum/CollectionName';
import { AskForHelpCollectionEntry } from './types/collections/AskForHelpCollectionEntry';
import { SolvedPostsCollectionEntry } from './types/collections/SolvedPostsCollectionEntry';

async function userIdsMatch(db: admin.firestore.Firestore, collectionName: CollectionName, documentId: string, uidFromRequest: string): Promise<boolean> {
  const docSnap = await db.collection(collectionName).doc(documentId).get();
  const docSnapData = docSnap.data() as AskForHelpCollectionEntry | SolvedPostsCollectionEntry;
  if (!docSnapData) return false;
  const { uid } = docSnapData.d;
  return uid === uidFromRequest;
}

async function migrateResponses(db: admin.firestore.Firestore, collectionToMigrateFrom: CollectionName, documentId: string, collectionToMigrateTo: CollectionName): Promise<void> {
  const responsesSnap = await db.collection(collectionToMigrateFrom)
    .doc(documentId)
    .collection('offer-help')
    .get();
  const responses = responsesSnap.docs
    .map((docSnapshot) => ({ ...docSnapshot.data(), id: docSnapshot.id }));

  const batch = db.batch();
  const subCollection = db.collection(collectionToMigrateTo).doc(documentId).collection('offer-help');
  responses.map((response) => batch.set(subCollection.doc(response.id), response));
  await batch.commit();
}

async function deleteQueryBatch(db: admin.firestore.Firestore, query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>, resolve: any, reject: any): Promise<void> {
  // code taken from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  try {

    const snapshot = await query.get()
    // When there are no documents left, we are done
    if (snapshot.size === 0) {
      return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit().then(() => snapshot.size)
      .then((numDeleted) => {
        if (numDeleted === 0) {
          return resolve();
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(async () => {
          await deleteQueryBatch(db, query, resolve, reject);
        });
      });

  } catch (error) {
    return reject(error);
  }
}

async function deleteCollection(db: admin.firestore.Firestore, collectionPath: string, batchSize: number): Promise<void> {
  // code taken from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => deleteQueryBatch(db, query, resolve, reject));
}

// db-admins API does not support recursive deletion yet,
// which is necessary to delete subcollections of a document
// https://github.com/firebase/firebase-admin-node/issues/361
async function deleteDocumentWithSubCollections(db: admin.firestore.Firestore, collectionName: CollectionName, documentId: string): Promise<void> {
  // delete document from collection
  await db.collection(collectionName).doc(documentId).delete();
  // recursive delete to remove the sub collections (e.g. responses) as well
  const collectionPath = `${collectionName}/${documentId}/offer-help`;
  const batchSize = 50;
  return deleteCollection(db, collectionPath, batchSize);
}

async function getEntriesOfUser(db: admin.firestore.Firestore, collection: CollectionName, key: string, uid: string, useCollectionGroup = false): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>> {
  if (!useCollectionGroup) {
    return db.collection(collection).where(key, '==', uid).get();
  }
  return db.collectionGroup(collection).where(key, '==', uid).get();
}

export {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
  getEntriesOfUser,
};
