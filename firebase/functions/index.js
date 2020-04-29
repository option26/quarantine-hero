const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const { GeoCollectionReference } = require('geofirestore');
const slack = require('./slack');
const { userIdsMatch, migrateResponses, deleteDocumentWithSubCollections } = require('./utils');

admin.initializeApp();
const envVariables = functions.config();

const sgMailApiKey = envVariables && envVariables.sendgrid && envVariables.sendgrid.key
  ? envVariables.sendgrid.key
  : null;
sgMail.setApiKey(sgMailApiKey);

const REGION_EUROPE_WEST_1 = 'europe-west1';
const MAX_RESULTS = 30;
const MAPS_ENABLED = true;
const MINIMUM_NOTIFICATION_DELAY = 20;
const SEND_EMAILS = sgMailApiKey !== null;
const sendingMailsDisabledLogMessage = 'Sending emails is currently disabled.';

async function onOfferHelpCreate(snap) {
  try {
    const parentPath = snap.ref.parent.path; // get the id
    const offerId = snap.id; // get the id
    const db = admin.firestore();
    const askForHelp = snap.ref.parent.parent;

    const offer = await db.collection(parentPath).doc(offerId).get();
    const askRecord = await askForHelp.get();
    if (!askRecord.exists) {
      // eslint-disable-next-line no-console
      console.error('ask-for-help at ', snap.ref.parent.parent.path, 'does not exist');
      return;
    }
    const { request, uid } = askRecord.data().d;
    const data = await admin.auth().getUser(uid);
    const { email: receiver } = data.toJSON();
    const { answer, email } = offer.data();

    // eslint-disable-next-line no-console
    console.log({
      to: receiver,
      from: email,
      templateId: 'd-ed9746e4ff064676b7df121c81037fab',
      dynamic_template_data: {
        subject: 'QuarantäneHelden - Jemand hat dir geschrieben!',
        answer,
        email,
        request,
      },
    });
    try {
      if (SEND_EMAILS) {
        await sgMail.send({
          to: receiver,
          from: 'help@quarantaenehelden.org',
          replyTo: {
            email,
          },
          templateId: 'd-ed9746e4ff064676b7df121c81037fab',
          dynamic_template_data: {
            subject: 'QuarantäneHelden - Jemand hat dir geschrieben!',
            answer,
            email,
            request,
          },
          hideWarnings: true, // removes triple bracket warning
        });
      } else {
        // eslint-disable-next-line no-console
        console.log(sendingMailsDisabledLogMessage);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      if (err.response && err.response.body && err.response.body.errors) {
        // eslint-disable-next-line no-console
        console.warn(err.response.body.errors);
      }
    }

    await db.collection('/ask-for-help').doc(askRecord.id).update({
      'd.responses': admin.firestore.FieldValue.increment(1),
    });
    await db.collection('/stats').doc('external').update({
      offerHelp: admin.firestore.FieldValue.increment(1),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function searchAndSendNotificationEmails() {
  const dist = (search, doc) => Math.abs(Number(search) - Number(doc.plz));

  const db = admin.firestore();

  const getEligibleHelpOffers = async (askForHelpSnapData) => {
    let queryResult = [];
    if (MAPS_ENABLED) {
      const offersRef = new GeoCollectionReference(db.collection('offer-help'));
      const query = offersRef.near({ center: askForHelpSnapData.coordinates, radius: 30 });
      queryResult = (await query.get()).docs.map((doc) => doc.data());
    } else {
      const offersRef = db.collection('offer-help');
      if (!askForHelpSnapData || !askForHelpSnapData.d || !askForHelpSnapData.d.plz) {
        // eslint-disable-next-line no-console
        console.warn('Failed to find plz for ask-for-help ', askForHelpSnapData);
      } else {
        const search = askForHelpSnapData.d.plz;
        const start = `${search.slice(0, -3)}000`;
        const end = `${search.slice(0, -3)}999`;
        const results = await offersRef.orderBy('d.plz').startAt(start).endAt(end).get();
        const allPossibleOffers = results.docs
          .map((doc) => ({ id: doc.id, ...doc.data().d }))
          .filter(({ plz }) => plz.length === search.length);
        const sortedOffers = allPossibleOffers
          .map((doc) => ({ ...doc, distance: dist(search, doc) }))
          .sort((doc1, doc2) => doc1.distance - doc2.distance);
        if (sortedOffers.length > MAX_RESULTS) {
          const lastEntry = sortedOffers[MAX_RESULTS];
          queryResult = sortedOffers.filter((doc) => doc.distance <= lastEntry.distance);
        } else {
          queryResult = sortedOffers;
        }
      }
    }

    let offersToContact = [];
    if (queryResult.length > MAX_RESULTS) {
      for (let i = queryResult.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * i);
        const temp = queryResult[i];
        queryResult[i] = queryResult[j];
        queryResult[j] = temp;
      }
      offersToContact = queryResult.slice(0, MAX_RESULTS);
    } else {
      offersToContact = queryResult;
    }
    return offersToContact;
  };

  const sendNotificationEmails = async (eligibleHelpOffers, askForHelpSnapData, askForHelpId) => {
    const result = await Promise.all(eligibleHelpOffers.map(async (offerDoc) => {
      try {
        const { uid } = offerDoc;
        const offeringUser = await admin.auth().getUser(uid);
        const { email } = offeringUser.toJSON();
        await sgMail.send({
          to: email,
          from: 'help@quarantaenehelden.org',
          templateId: 'd-9e0d0ec8eda04c9a98e6cb1edffdac71',
          dynamic_template_data: {
            subject: 'QuarantäneHelden - Jemand braucht Deine Hilfe!',
            request: askForHelpSnapData.d.request,
            location: askForHelpSnapData.d.location,
            link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
            reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
          },
          hideWarnings: true, // removes triple bracket warning
        });

        await db.collection('/ask-for-help').doc(askForHelpId).update({
          'd.notificationCounter': admin.firestore.FieldValue.increment(1),
          'd.notificationReceiver': admin.firestore.FieldValue.arrayUnion(uid),
        });
        return { askForHelpId, email };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
        if (err.response && err.response.body && err.response.body.errors) {
          // eslint-disable-next-line no-console
          console.warn(err.response.body.errors);
        }
        return null;
      }
    }));
    // eslint-disable-next-line no-console
    console.log(result);
  };

  try {
    const askForHelpSnaps = await db.collection('ask-for-help')
      .where('d.timestamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY * 60 * 1000)
      .where('d.notificationCounter', '==', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('askForHelp Requests to execute', askForHelpSnaps.docs.length);
    // RUN SYNC
    const asyncOperations = askForHelpSnaps.docs.map(async (askForHelpSnap) => {
      const askForHelpSnapData = askForHelpSnap.data();
      const askForHelpId = askForHelpSnap.id;
      const eligibleHelpOffers = await getEligibleHelpOffers(askForHelpSnapData);
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      console.log('eligibleHelpOffers', eligibleHelpOffers.length);
      if (SEND_EMAILS) {
        return sendNotificationEmails(eligibleHelpOffers, askForHelpSnapData, askForHelpId);
      }
      // eslint-disable-next-line no-console
      return console.log(sendingMailsDisabledLogMessage);
    });
    await Promise.all(asyncOperations);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

async function onReportedPostsCreate(snap) {
  try {
    const db = admin.firestore();
    const snapValue = snap.data();
    const { askForHelpId, uid } = snapValue;

    // https://cloud.google.com/firestore/docs/manage-data/add-data#update_elements_in_an_array
    await db.collection('/ask-for-help').doc(askForHelpId).update({
      'd.reportedBy': admin.firestore.FieldValue.arrayUnion(uid),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onAskForHelpCreate(snap) {
  try {
    const db = admin.firestore();
    const askForHelpId = snap.id; // get the id
    const parentPath = snap.ref.parent.path; // get the id
    const askForHelpSnap = await db.collection(parentPath).doc(askForHelpId).get();
    const askForHelpSnapData = askForHelpSnap.data();

    // Enforce field to 0
    await snap.ref.update({
      'd.notificationCounter': 0,
    });

    await db.collection('/stats').doc('external').update({
      askForHelp: admin.firestore.FieldValue.increment(1),
    });

    await slack.postToSlack(askForHelpId, askForHelpSnapData);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onSubscribeToBeNotifiedCreate(snap) {
  try {
    const db = admin.firestore();
    await db.collection('/stats').doc('external').update({
      regionSubscribed: admin.firestore.FieldValue.increment(1),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onSolvedPostsCreate(snap) {
  try {
    const db = admin.firestore();
    const snapValue = snap.data();
    const { uid } = snapValue;
    const askForHelpCollectionName = 'ask-for-help';

    if (!userIdsMatch(db, askForHelpCollectionName, snap.id, uid)) return;

    await migrateResponses(db, askForHelpCollectionName, snap.id, 'solved-posts');
    await deleteDocumentWithSubCollections(db, askForHelpCollectionName, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onDeleletedCreate(snap) {
  try {
    const db = admin.firestore();
    const snapValue = snap.data();
    // collectionName can be either "ask-for-help" or "solved-posts"
    const { uid, collectionName } = snapValue;

    if (!userIdsMatch(db, collectionName, snap.id, uid)) return;

    await migrateResponses(db, collectionName, snap.id, 'deleted');
    await deleteDocumentWithSubCollections(db, collectionName, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

exports.sendNotificationEmails = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-23 * * *') // At every 3rd minute past every hour from 9 through 23.
  .timeZone('Europe/Berlin')
  .onRun(searchAndSendNotificationEmails);

exports.askForHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/ask-for-help/{requestId}')
  .onCreate(onAskForHelpCreate);

exports.regionSubscribeCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/offer-help/{helperId}')
  .onCreate(onSubscribeToBeNotifiedCreate);

exports.reportedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/reported-posts/{reportRequestId}')
  .onCreate(onReportedPostsCreate);

exports.solvedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/solved-posts/{reportRequestId}')
  .onCreate(onSolvedPostsCreate);

exports.deletedCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/deleted/{reportRequestId}')
  .onCreate(onDeleletedCreate);

exports.offerHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/ask-for-help/{requestId}/offer-help/{offerId}')
  .onCreate(onOfferHelpCreate);
