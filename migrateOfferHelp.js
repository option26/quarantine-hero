const admin = require('./firebase/functions/node_modules/firebase-admin');

const doMigration = async () => {
  const serviceAccount = require('/Users/dev/Downloads/qhero-stage-firebase-adminsdk-e3ogb-355e92f39d.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://qhero-stage.firebaseio.com',
  });
  const data = await admin.firestore().collection('offer-help').get();

  const batch = admin.firestore().batch();

  data.docs.forEach((doc) => {
    const ref = admin.firestore().collection('notifications').doc(doc.id);
    batch.set(ref, doc.data());
  });

  await batch.commit();
};

doMigration();
