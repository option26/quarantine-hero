import * as admin from 'firebase-admin';
import { Change, firestore } from 'firebase-functions';

import { getEligibleHelpOffers } from '@utilities/email/getEligibleHelpOffers';
import { sendNotificationEmailsForOffers } from '@utilities/email/sendNotificationEmailsForOffers';

import {
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage
} from '@config';

import { AskForHelpCollectionEntry } from '@interface/collections/AskForHelpCollectionEntry';

export async function onAskForHelpUpdate(change: Change<firestore.QueryDocumentSnapshot>): Promise<void> {
  try {
    const db = admin.firestore();
    const snap = change.after;
    const askForHelpId = snap.id; // get the id
    const parentPath = snap.ref.parent.path; // get the id
    const askForHelpSnap = await db.collection(parentPath).doc(askForHelpId).get();
    const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;

    const { uid, requestingMoreHelp, timeStampLastHelpRequest, notificationCounter } = askForHelpSnapData.d;

    // early return if the user does not request help or is not eligible for more help
    if (!requestingMoreHelp) return;
    if (notificationCounter > MAXIMUM_ALLOWED_REQUESTS_FOR_HELP) {
      console.log('Maximum amount of allowed request reached for user', notificationCounter, uid, snap.id);
      return;
    }
    if (timeStampLastHelpRequest <= Date.now() - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000) {
      console.log('User is attempting to request help again within the cool down period', timeStampLastHelpRequest, uid, snap.id);
      return;
    }

    const eligibleHelpOffers = await getEligibleHelpOffers(db, askForHelpId, askForHelpSnapData);
    // eslint-disable-next-line no-console
    console.log('askForHelpId', askForHelpId);
    // eslint-disable-next-line no-console
    console.log('eligibleHelpOffers', eligibleHelpOffers.length);
    if (SEND_EMAILS) {
      const templateId = 'd-9e0d0ec8eda04c9a98e6cb1edffdac71';
      const templateData = {
        subject: 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!',
        request: askForHelpSnapData.d.request,
        location: askForHelpSnapData.d.location,
        link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
        reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
      };
      return sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpId, templateId, templateData);
    }
    // eslint-disable-next-line no-console
    console.log(sendingMailsDisabledLogMessage);

    await snap.ref.update({
      'd.notificationCounter': notificationCounter + 1,
      'd.timeStampLastHelpRequest': Date.now(),
      'd.requestingMoreHelp': false
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', change.after.id);
  }
}
