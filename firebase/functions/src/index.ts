import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { GeoCollectionReference, GeoQuery } from 'geofirestore';

import { postToSlack } from './slack';
import { handleIncomingCall as handleIncomingCallFromHotline } from './hotline';
import {
  userIdsMatch,
  migrateResponses,
  deleteDocumentWithSubCollections,
  getEntriesOfUser,
} from './utils';

import { AskForHelpCollectionEntry } from './types/collections/AskForHelpCollectionEntry';
import { OfferHelpCollectionEntry } from './types/collections/OfferHelpCollectionEntry';
import { NotificationsCollectionEntry } from './types/collections/NotificationsCollectionEntry';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { ReportedPostsCollectionEntry } from './types/collections/ReportedPostsCollectionEntry';
import { SolvedPostsCollectionEntry } from './types/collections/SolvedPostsCollectionEntry';
import { DeletedCollectionEntry } from './types/collections/DeletedCollectionEntry';
import { CollectionName } from './types/enum/CollectionName';

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
const EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK = 35_000;

async function onOfferHelpCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const parentPath = snap.ref.parent.path; // get the id
    const offerId = snap.id; // get the id
    const db = admin.firestore();
    const askForHelp = snap.ref.parent.parent;

    if (!askForHelp) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp} does not exist`);
      return;
    }

    const offer = await db.collection(parentPath).doc(offerId).get();
    const askRecord = await askForHelp.get();

    if (!askRecord || !askRecord.exists) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp.path} does not exist`);
      return;
    }

    const askRecordData = askRecord && askRecord.data() as AskForHelpCollectionEntry
    const { request, uid } = askRecordData.d;

    const data = await admin.auth().getUser(uid);
    const { email: receiver } = data.toJSON() as UserRecord;

    const offerRecordData = offer.data() as OfferHelpCollectionEntry;
    const { answer, email } = offerRecordData

    const sendgridOptions = {
      to: receiver,
      from: 'help@quarantaenehelden.org',
      templateId: 'd-ed9746e4ff064676b7df121c81037fab',
      replyTo: { email },
      hideWarnings: true, // removes triple bracket warning
      dynamic_template_data: {
        subject: 'QuarantäneHeld*innen - Jemand hat Dir geschrieben!',
        answer,
        email,
        request,
        askForHelpLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelp.id}`,
      }
    };

    // eslint-disable-next-line no-console
    console.log(sendgridOptions);

    try {
      if (SEND_EMAILS) {
        // without "any" casting, sendgrid complains about sendgridOptions typing
        await sgMail.send(sendgridOptions as any);
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

async function searchAndSendNotificationEmails(): Promise<void> {
  const dist = (search: string, doc: NotificationsCollectionEntry['d']) => Math.abs(Number(search) - Number(doc.plz));

  const db = admin.firestore();

  const getEligibleHelpOffers = async (askForHelpId: string, askForHelpSnapData: AskForHelpCollectionEntry) => {
    let queryResult: NotificationsCollectionEntry['d'][] = [];
    if (MAPS_ENABLED) {
      const notificationsRef: GeoCollectionReference = new GeoCollectionReference(db.collection(CollectionName.Notifications));
      const { coordinates } = askForHelpSnapData.d;
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        // eslint-disable-next-line no-console
        console.warn('Coordinates are not defined!', coordinates);
        throw new Error(`Coordinates for entry ${askForHelpId} are not set!`);
      }
      const query: GeoQuery = notificationsRef.near({ center: coordinates, radius: 30 });
      queryResult = (await query.get()).docs.map((doc) => doc.data());
      // eslint-disable-next-line no-console
      console.log(`Received ${queryResult.length} results for ${askForHelpId}`);
      if (queryResult.length >= EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK) {
        throw new Error(`Sanity check for ${askForHelpId} failed! Query result size: ${queryResult.length}`);
      }
    } else {
      const notificationsRef = db.collection('notifications');
      if (!askForHelpSnapData || !askForHelpSnapData.d || !askForHelpSnapData.d.plz) {
        // eslint-disable-next-line no-console
        console.warn('Failed to find plz for ask-for-help ', askForHelpSnapData);
      } else {
        const search = askForHelpSnapData.d.plz;
        const start = `${search.slice(0, -3)}000`;
        const end = `${search.slice(0, -3)}999`;
        const results = await notificationsRef.orderBy('d.plz').startAt(start).endAt(end).get();
        const allPossibleOffers: NotificationsCollectionEntry['d'][] = results.docs
          .map((doc) => ({ id: doc.id, ...doc.data().d as NotificationsCollectionEntry['d'] }))
          .filter(({ plz }) => plz.length === search.length);
        const sortedOffers: NotificationsCollectionEntry['d'][] = allPossibleOffers
          .map((doc) => ({ ...doc, distance: dist(search, doc) }))
          .sort((doc1, doc2) => doc1.distance - doc2.distance);
        if (sortedOffers.length > MAX_RESULTS) {
          const lastEntry = sortedOffers[MAX_RESULTS];
          queryResult = sortedOffers.filter((doc) => doc.distance && lastEntry.distance && doc.distance <= lastEntry.distance);
        } else {
          queryResult = sortedOffers;
        }
      }
    }

    let offersToContact: NotificationsCollectionEntry['d'][] = [];
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

  const sendNotificationEmailsForOffers = async (eligibleHelpOffers: NotificationsCollectionEntry['d'][], askForHelpSnapData: AskForHelpCollectionEntry, askForHelpId: string) => {
    const result = await Promise.all(eligibleHelpOffers.map(async (offerDoc: NotificationsCollectionEntry['d']) => {
      try {
        const { uid } = offerDoc;
        const offeringUser = await admin.auth().getUser(uid);
        const { email } = offeringUser.toJSON() as UserRecord;
        const sendgridOptions = {
          to: email,
          from: 'help@quarantaenehelden.org',
          templateId: 'd-9e0d0ec8eda04c9a98e6cb1edffdac71',
          dynamic_template_data: {
            subject: 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!',
            request: askForHelpSnapData.d.request,
            location: askForHelpSnapData.d.location,
            link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
            reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
          },
          hideWarnings: true, // removes triple bracket warning
        }
        // without "any" casting, sendgrid complains about sendgridOptions typing
        await sgMail.send(sendgridOptions as any);

        await db.collection(CollectionName.AskForHelp).doc(askForHelpId).update({
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
    const askForHelpSnaps = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY * 60 * 1000)
      .where('d.notificationCounter', '==', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('askForHelp Requests to execute', askForHelpSnaps.docs.length);
    // RUN SYNC
    const asyncOperations = askForHelpSnaps.docs.map(async (askForHelpSnap) => {
      const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
      const askForHelpId = askForHelpSnap.id;
      const eligibleHelpOffers = await getEligibleHelpOffers(askForHelpId, askForHelpSnapData);
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      console.log('eligibleHelpOffers', eligibleHelpOffers.length);
      if (SEND_EMAILS) {
        return sendNotificationEmailsForOffers(eligibleHelpOffers, askForHelpSnapData, askForHelpId);
      }
      // eslint-disable-next-line no-console
      console.log(sendingMailsDisabledLogMessage);
    });
    await Promise.all(asyncOperations);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

async function onReportedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
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

async function onAskForHelpCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
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

async function onSubscribeToBeNotifiedCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
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

async function onSolvedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as SolvedPostsCollectionEntry;
    const { uid } = snapValue.d;

    if (!userIdsMatch(db, CollectionName.AskForHelp, snap.id, uid)) return;

    await migrateResponses(db, CollectionName.AskForHelp, snap.id, CollectionName.SolvedPosts);
    await deleteDocumentWithSubCollections(db, CollectionName.AskForHelp, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onDeletedCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as DeletedCollectionEntry;
    // collectionName can be either "ask-for-help" or "solved-posts"
    const { collectionName } = snapValue
    const { uid } = snapValue.d;

    if (!userIdsMatch(db, collectionName, snap.id, uid)) return;

    await migrateResponses(db, collectionName, snap.id, CollectionName.Deleted);
    await deleteDocumentWithSubCollections(db, collectionName, snap.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}

async function onUserDelete(user: UserRecord): Promise<void> {
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
      const data = doc && doc.data()
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


const sendNotificationEmails = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-23 * * *') // At every 3rd minute past every hour from 9 through 23.
  .timeZone('Europe/Berlin')
  .onRun(searchAndSendNotificationEmails);

const askForHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/ask-for-help/{requestId}')
  .onCreate(onAskForHelpCreate);

const regionSubscribeCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/notifications/{helperId}')
  .onCreate(onSubscribeToBeNotifiedCreate);

const reportedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/reported-posts/{reportRequestId}')
  .onCreate(onReportedPostsCreate);

const solvedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/solved-posts/{reportRequestId}')
  .onCreate(onSolvedPostsCreate);

const deletedCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/deleted/{reportRequestId}')
  .onCreate(onDeletedCreate);

const offerHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document('/ask-for-help/{requestId}/offer-help/{offerId}')
  .onCreate(onOfferHelpCreate);

const handleIncomingCall = functions
  .region(REGION_EUROPE_WEST_1)
  .https
  .onRequest(handleIncomingCallFromHotline);

const deleteUserData = functions
  .region(REGION_EUROPE_WEST_1)
  .auth
  .user()
  .onDelete(onUserDelete);

export {
  sendNotificationEmails,
  askForHelpCreate,
  regionSubscribeCreate,
  reportedPostsCreate,
  solvedPostsCreate,
  deletedCreate,
  offerHelpCreate,
  handleIncomingCall,
  deleteUserData,
}
