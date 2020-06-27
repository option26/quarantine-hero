import * as admin from 'firebase-admin';

import { getEligibleHelpOffers } from '@utilities/email/getEligibleHelpOffers';
import { sendNotificationEmailsForOffers } from '@utilities/email/sendNotificationEmailsForOffers';

import {
  MINIMUM_NOTIFICATION_DELAY_INITIAL_CONTACT_WITH_OPEN_ENTRIES_MINUTES,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '@config';

import { AskForHelpCollectionEntry } from '@interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '@enum/CollectionName';

export async function searchAndSendNotificationEmails(): Promise<void> {
  try {
    const db = admin.firestore();
    const askForHelpSnaps = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY_INITIAL_CONTACT_WITH_OPEN_ENTRIES_MINUTES * 60 * 1000)
      .where('d.notificationCounter', '==', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('askForHelp Requests to execute', askForHelpSnaps.docs.length);
    // RUN SYNC
    const asyncOperations = askForHelpSnaps.docs.map(async (askForHelpSnap) => {
      const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
      const askForHelpId = askForHelpSnap.id;
      const eligibleHelpOffers = await getEligibleHelpOffers(db, askForHelpId, askForHelpSnapData);
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      console.log('eligibleHelpOffers', eligibleHelpOffers.length);
      if (SEND_EMAILS) {
        return sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpSnapData, askForHelpId);
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
