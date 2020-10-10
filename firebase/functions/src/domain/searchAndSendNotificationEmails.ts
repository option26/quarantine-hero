import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { GeoCollectionReference, GeoQuery } from 'geofirestore';

import {
  MAX_RESULTS,
  MAPS_ENABLED,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
  MINIMUM_NOTIFICATION_DELAY,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '../config';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { NotificationsCollectionEntry } from '../types/interface/collections/NotificationsCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { postReplyToSlack } from 'src/utilities/slack';

export async function searchAndSendNotificationEmails(): Promise<void> {
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
      const notificationsRef = db.collection(CollectionName.Notifications);
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

    let eligibleHelpOffers: NotificationsCollectionEntry['d'][] = [];
    if (queryResult.length > MAX_RESULTS) {
      for (let i = queryResult.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * i);
        const temp = queryResult[i];
        queryResult[i] = queryResult[j];
        queryResult[j] = temp;
      }
      eligibleHelpOffers = queryResult.slice(0, MAX_RESULTS);
    } else {
      eligibleHelpOffers = queryResult;
    }
    return { initalSize: queryResult.length, eligibleHelpOffers };
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
        };
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
      const { initalSize, eligibleHelpOffers } = await getEligibleHelpOffers(askForHelpId, askForHelpSnapData);
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      console.log('eligibleHelpOffers', eligibleHelpOffers.length);
      if (SEND_EMAILS) {
        return sendNotificationEmailsForOffers(eligibleHelpOffers, askForHelpSnapData, askForHelpId);
      }

      try {
        const message = `Potentielle Helfende: ${initalSize}\n` + (SEND_EMAILS ? `Gesendete Emails: ${eligibleHelpOffers.length}` : 'Emails deaktiviert!');
        await postReplyToSlack(askForHelpSnapData.d.slackMessageRef, message);
      } catch (err) {
        console.log('Error posting to slack', err);
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
