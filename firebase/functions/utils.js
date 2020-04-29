
async function userIdsMatch(db, collectionName, documentId, uidFromRequest) {
  const docSnap = await db.collection(collectionName).doc(documentId).get();
  const docSnapData = docSnap.data();
  const { uid } = docSnapData;
  return uid === uidFromRequest;
}

async function migrateResponses(db, collectionToMigrateFrom, documentId, collectionToMigrateTo) {
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

async function deleteQueryBatch(db, query, resolve, reject) {
  // code taken from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  return query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => snapshot.size)
        .then((numDeleted) => {
          if (numDeleted === 0) {
            resolve();
            return;
          }

          // Recurse on the next process tick, to avoid
          // exploding the stack.
          process.nextTick(() => {
            deleteQueryBatch(db, query, resolve, reject);
          });
        });
    })
    .catch(reject);
}

async function deleteCollection(db, collectionPath, batchSize) {
  // code taken from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => deleteQueryBatch(db, query, resolve, reject));
}

// db-admins API does not support recursive deletion yet,
// which is necessary to delete subcollections of a document
// https://github.com/firebase/firebase-admin-node/issues/361
async function deleteDocumentWithSubCollections(db, collectionName, documentId) {
  // delete document from collection
  await db.collection(collectionName).doc(documentId).delete();
  // recursive delete to remove the sub collections (e.g. responses) as well
  const collectionPath = `${collectionName}/${documentId}/offer-help`;
  const batchSize = 50;
  return deleteCollection(db, collectionPath, batchSize);
}

async function getEntriesOfUser(db, collection, key, uid, useCollectionGroup = false) {
  let userEntries;
  if (!useCollectionGroup) {
    userEntries = await db.collection(collection).where(key, '==', uid).get();
  } else {
    userEntries = await db.collectionGroup(collection).where(key, '==', uid).get();
  }
  return userEntries;
}

module.exports = {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
  getEntriesOfUser,
};
