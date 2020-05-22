const admin = require('./firebase/functions/node_modules/firebase-admin');

const doMigration = async () => {
  const serviceAccount = require('<TODO>');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://qhero-stage.firebaseio.com',
  });
  const data = await admin.firestore().collection('offer-help').get();

  let batch = admin.firestore().batch();

  for (let i = 0; i < data.docs.length; i += 1) {
    const doc = data.docs[i];
    const ref = admin.firestore().collection('notifications').doc(doc.id);
    batch.set(ref, doc.data());

    // Be well under the limit of 500 operations in one batch
    if ((i + 1) % 400 === 0) {
      batch.commit();
      batch = admin.firestore().batch();
    }
  }
};

doMigration();
